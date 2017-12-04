pragma solidity ^0.4.18;

import "./Math.sol";
import "./Tokens/Token.sol";

/// @title Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - <dominik@gnosis.pm>

contract DutchExchange {

    // The price is a rational number, so we need a concept of a fraction
    struct fraction {
        uint num;
        uint den;
    }

    address public owner;
    address public ETH;
    address public ETHUSDOracle;
    address public TUL;
    address public WIZ;

    // Token => Token => index
    mapping (address => mapping (address => uint)) public latestAuctionIndices;
    // Token => Token => auctionIndex => price
    mapping (address => mapping (address => mapping (uint => fraction))) public closingPrices;
    // Token => oracle
    mapping (address => address) public priceOracles;

    // Token => Token => time
    // Will always be in the past except when:
    // 1. A new token pair is added
    // 2. An auction doesn't receive any sellOrders
    // In both cases, the first sellOrder will schedule the auction to begin in 6 hours
    mapping (address => mapping (address => uint)) public auctionStarts;

    // Token => user => amount
    mapping (address => mapping (address => uint)) public balances;

    // Token => Token => auctionIndex => amount
    // We store historical values, because they are necessary to calculate extraTokens
    mapping (address => mapping (address => mapping (uint => uint))) public sellVolumes;
    mapping (address => mapping (address => mapping (uint => uint))) public buyVolumes;

    // Token => Token => auctionIndex => amount
    mapping (address => mapping (address => mapping (uint => uint))) public extraSellTokens;
    mapping (address => mapping (address => mapping (uint => uint))) public extraBuyTokens;

    // Token => Token => user => auctionIndex => amount
    mapping (address => mapping (address => mapping (uint => mapping (address => uint)))) public sellerBalances;
    mapping (address => mapping (address => mapping (uint => mapping (address => uint)))) public buyerBalances;
    mapping (address => mapping (address => mapping (uint => mapping (address => uint)))) public claimedAmounts;

    // Events
    event NewDeposit(address indexed token, uint indexed amount);
    event NewWithdrawal(address indexed token, uint indexed amount);
    event NewSellOrder(
        address indexed sellToken,
        address indexed buyToken,
        address indexed user,
        uint auctionIndex,
        uint amount
    );
    event NewBuyOrder(
        address indexed sellToken,
        address indexed buyToken,
        address indexed user,
        uint auctionIndex,
        uint amount
    );
    event NewSellerFundsClaim(
        address indexed sellToken,
        address indexed buyToken,
        address indexed user,
        uint auctionIndex,
        uint amount
    );
    event NewBuyerFundsClaim(
        address indexed sellToken,
        address indexed buyToken,
        address indexed user,
        uint auctionIndex,
        uint amount
    );
    event AuctionCleared(address indexed sellToken, address indexed buyToken, uint indexed auctionIndex);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier existingToken(address token) {
        require(priceOracles[token] > 0);
        _;
    }

    modifier existingTokenPair(address sellToken, address buyToken) {
        require(latestAuctionIndices[sellToken][buyToken] > 0);
        _;
    }

    /// @dev Constructor creates exchange
    /// @param owner address. Only owner can set up new token pairs and halt trading
    /// @param address of ETH ERC-20 token
    /// @param address of ETH/USD price oracle
    /// @param address of TUL ERC-20 token. Tulips are a loyalty scheme
    /// @param address of WIZ tokens
    function DutchExchange(
        address _owner,
        address _ETH,
        address _ETHUSDOracle,
        address _TUL,
        address _WIZ
    )
        public
    {
        owner = _owner;
        ETH = _ETH;
        ETHUSDOracle = _ETHUSDOracle;
        TUL = _TUL;
        WIZ = _WIZ;
    }

    /// @param Address of Token that is used to fund auction
    /// @param Address of price oracle between sellToken and ETH. If sellToken == ETH, can be arbitrary address
    /// @param Address of Token that is used to buy into auctions
    /// @param Address of price oracle between buyToken and ETH. If buyToken == ETH, can be arbitrary address
    /// @param The initial price will be 2 * initialClosingPrice. This is its numerator
    /// @param The initial price will be 2 * initialClosingPrice. This is its denominator
    function addTokenPair(
        address sellToken,
        address sellTokenETHOracle,
        address buyToken,
        address buyTokenETHOracle,
        uint initialClosingPriceNum,
        uint initialClosingPriceDen
    )
        public
        onlyOwner()
    {
        require(initialClosingPriceNum != 0);
        require(initialClosingPriceDen != 0);

        // If neither token is ETH, we require there to exist ETH-Token auctions
        if (sellToken != ETH && buyToken != ETH) {
            require(latestAuctionIndices[sellToken][ETH] > 0);
            require(latestAuctionIndices[ETH][sellToken] > 0);
            require(latestAuctionIndices[buyToken][ETH] > 0);
            require(latestAuctionIndices[ETH][buyToken] > 0);
        }

        if (sellToken != ETH) {
            priceOracles[sellToken] = sellTokenETHOracle;
        }

        if (buyToken != ETH) {
            priceOracles[buyToken] = buyTokenETHOracle;
        }

        // If Solidity was to change, this ensures the next sellOrder
        // will still schedule the next auction in 6 hrs as required
        auctionStarts[sellToken][buyToken] = 0;
        auctionStarts[buyToken][sellToken] = 0;
        // Save price
        fraction memory initialClosingPrice = fraction(initialClosingPriceNum, initialClosingPriceDen);
        closingPrices[sellToken][buyToken][0] = initialClosingPrice;
        initialClosingPrice = fraction( initialClosingPriceDen,initialClosingPriceNum);
        closingPrices[buyToken][sellToken][0] = initialClosingPrice;

        // Update other variables
        latestAuctionIndices[sellToken][buyToken] = 1;
        latestAuctionIndices[buyToken][sellToken] = 1;
    }

    function deposit(
        address tokenAddress,
        uint amount
    )
        public
        existingToken(tokenAddress)
    {
        require(Token(tokenAddress).transferFrom(msg.sender, this, amount));
        balances[tokenAddress][msg.sender] += amount;
        NewDeposit(tokenAddress, amount);
    }

    function withdraw(
        address tokenAddress,
        uint amount
    )
        public
        existingToken(tokenAddress)
    {
        amount = Math.min(amount, balances[tokenAddress][msg.sender]);
        require(amount > 0);

        balances[tokenAddress][msg.sender] -= amount;
        require(Token(tokenAddress).transfer(msg.sender, amount));
        NewWithdrawal(tokenAddress, amount);
    }

    function postSellOrder(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint amountSubmitted,
        uint amountOfWIZToBurn
    )
        public
        existingTokenPair(sellToken, buyToken)
    {
        uint latestAuctionIndex = latestAuctionIndices[sellToken][buyToken];

        // The following logic takes care primarily of first auctions
        // or when an auction receives 0 sell orders or rezi receives zero sell orders
        // In those two cases, auctionIndex will be latestAuctionIndex
        // (In all other cases, it will be latestAuctionIndex + 1)
        if (auctionStarts[sellToken][buyToken] <= 1) {
            // If no auction is scheduled, we accept sell orders only for current auction
            require(auctionIndex == latestAuctionIndex);

        } else if (auctionStarts[sellToken][buyToken] > now) {
            // There is a scheduled action, we accept sell orders only for that auction
            require(auctionIndex == latestAuctionIndex);
            // We accept sell orders only in the first 6 hours
            //require(auctionStarts[sellToken][buyToken] < now + 6 * 1 hours);
            // NOT NEEDED I THINK
        } else {
            // This case happens more than 99% of the time
            // Sell orders are accepted only for next auction
            require(auctionIndex == latestAuctionIndex + 1);
        }

        uint amount = Math.min(amountSubmitted, balances[sellToken][msg.sender]);

        require(amount > 0);

        // Fee mechanism
        uint fee = calculateFee(sellToken, buyToken, msg.sender, amount, amountOfWIZToBurn);
        // Fees are added to extraSellTokens -> current auction in the edge cases,
        // next auction in the majority case
        extraSellTokens[sellToken][buyToken][auctionIndex] += fee;
        uint amountAfterFee = amount - fee;

        // Update variables
        balances[sellToken][msg.sender] -= amount;
        sellerBalances[auctionIndex][msg.sender] += amountAfterFee;
        sellVolumes[auctionIndex] += amountAfterFee;
        waitOrScheduleNextAuction(sellToken,buyToken,latestAuctionIndex);
        NewSellOrder(sellToken, buyToken, msg.sender, auctionIndex, amount);
    }

    function postBuyOrder(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint amountSubmitted,
        uint amountOfWIZToBurn
    )
        public
        existingTokenPair(sellToken, buyToken)
    {
        // Requirements
        // TODO
        require(auctionStarts[sellToken][buyToken] >= now);

        uint latestAuctionIndex = latestAuctionIndices[sellToken][buyToken];
        require(auctionIndex == latestAuctionIndex);

        uint auctionIndex = latestAuctionIndices[sellToken][buyToken];
        checkReziproityMarket(auctionIndex,sellToken,buyToken);
        uint amount = Math.min(amountSubmitted, balances[buyToken][msg.sender]);

        // Fee mechanism
        uint fee = calculateFee(sellToken, buyToken, msg.sender, amount, amountOfWIZToBurn);
        // Fees are always added to next auction
        extraBuyTokens[sellToken][buyToken][auctionIndex + 1] += fee;
        uint amountAfterFee = amount - fee;

        // Overbuy is when a part of a buy order clears an auction
        // In that case we only process the part before the overbuy
        // To calculate overbuy, we first get current price
        uint num;
        uint den;
        (num, den) = getPrice(auctionIndex);

        uint sellVolume = sellVolumes[sellToken][buyToken][auctionIndex];
        uint buyVolume = buyVolumes[sellToken][buyToken][auctionIndex];
        int overbuy = int(buyVolume + amountAfterFee - sellVolume * num / den);

        if (int(amountAfterFee) > overbuy) {
            // We must process the buy order
            if (overbuy > 0) {
                // We have to adjust the amount
                amountAfterFee -= uint(overbuy);
            }

            // Update variables
            balances[buyToken][msg.sender] -= amount;
            buyerBalances[auctionIndex][msg.sender] += amountAfterFee;
            buyVolumes[sellToken][buyToken][auctionIndex] += amountAfterFee;
            NewBuyOrder(auctionIndex, msg.sender, amount);
        }

        if (overbuy >= 0) {
            // Clear auction
            uint finalBuyVolume = buyVolume + amountAfterFee - overbuy;
            clearAuction(sellToken, buyToken, finalBuyVolume, sellVolume);
        }
    }
    function checkReziproityMarket(uint auctionIndex, address sellToken, address buyToken) public
    {
      // Check whether ReziproAuction already closed:
      if(closingPrices[sellToken][buyToken][auctionIndex].den!=0)
      {
        uint num;
        uint den;
        (num, den) = getPrice(sellToken, buyToken, auctionIndex);
        fraction memory lastClosingPrice = closingPrices[sellToken][buyToken][auctionIndex - 1];
        uint numLastAuction= lastClosingPrice.num;
        uint denLastAuction= lastClosingPrice.den;

        // Check wheter there is an arbitrage possibility
        // num*denRezi<den*numRezi ensures that DutchAuction prices have crossed
        if(num*denLastAuction<den*numLastAuction){
          //calculate outstanding volumes for both makets at time of priceCrossing:
          uint numRezi=denLastAuction;
          uint denRezi=numLastAuction;
          uint sellVolume = sellVolumes[sellToken][buyToken][auctionIndex];
          uint buyVolume = buyVolumes[sellToken][buyToken][auctionIndex];
          int missingVolume= int(buyVolume  - sellVolume * num / den);

          uint sellVolumeRezi = sellVolumes[buyToken][sellToken][auctionIndex];
          uint buyVolumeRezi = buyVolumes[buyToken][sellToken][auctionIndex];
          int missingVolumeRezi= int(buyVolumeRezi  - sellVolumeRezi * numRezi / denRezi)* num / den;

          // fill up the Auction with smaller missing volume
          if( missingVolume>0 && missingVolumeRezi>0)
          {
              if(missingVolumeRezi<missingVolume){
                fillUpReziAuction(sellToken,buyToken,missingVolumeRezi,num,den,auctionIndex);
              }
              else{
                fillUpReziAuction(buyToken,sellToken,missingVolume,numRezi,denRezi,auctionIndex);
              }
          }
          else{
            //edge cases where the last BuyOrder were not enough to fill the sell order, but then price decreased laster and with the later price, acutally it would have been enough
            if(missingVolume<=0){
              clearAuction(sellToken, buyToken, buyVolume, sellVolume);
            }
            if(missingVolumeRezi<=0){
              clearAuction(buyToken, sellToken, buyVolumeRezi* den / num, sellVolumeRezi);
              }
          }
      }
      }
    }
    function fillUpReziAuction(address sellToken,address buyToken, uint volume, uint numClearing, uint denClearing, uint auctionIndex)
    internal
    {
      buyVolumes[sellToken][buyToken][auctionIndex] += volume;
      sellVolumes[sellToken][buyToken][auctionIndex] -= volume*denClearing/numClearing;
      clearAuction(sellToken , buyToken, buyVolumes[sellToken][buyToken][auctionIndex], buyVolumes[sellToken][buyToken][auctionIndex]*denClearing/numClearing);
    }



    function claimSellerFunds(
        address sellToken,
        address buyToken,
        address user,
        uint auctionIndex
    )
        public
        returns (uint returned)
    {
        // Requirements
        uint256 sellerBalance = sellerBalances[sellToken][buyToken][user][auctionIndex];
        require(sellerBalance > 0);

        // Checks if particular auction has cleared
        require(auctionIndex > latestAuctionIndices[sellToken][buyToken]);

        // Get closing price for said auction
        fraction memory closingPrice = closingPrices[sellToken][buyToken][auctionIndex];
        uint256 num = closingPrice.num;
        uint256 den = closingPrice.den;

        // Calculate return amount
        returned = sellerBalance * num / den;
        uint extraTokensTotal = extraBuyTokens[sellToken][buyToken][auctionIndex];
        uint extraTokens = sellerBalance * extraTokensTotal / sellVolumes[sellToken][buyToken][auctionIndex];
        returned += extraTokens;

        // Claim tokens
        sellerBalances[sellToken][buyToken][user][auctionIndex] = 0;
        balances[buyToken][user] += returned;
        NewSellerFundsClaim(sellToken, buyToken, user, auctionIndex, returned);
    }

    function claimBuyerFunds(
        address sellToken,
        address buyToken,
        address user,
        uint auctionIndex
    )
        public
        returns (uint returned)
    {
        returned = getUnclaimedBuyerFunds(sellToken, buyToken, user, auctionIndex);
        require(returned > 0);

        uint latestAuctionIndex = latestAuctionIndices[sellToken][buyToken];
        if (auctionIndex == latestAuctionIndex) {
            // Auction is running
            claimedAmounts[sellToken][buyToken][user][auctionIndex] += returned;
        } else {
            // Auction has closed
            // Reset buyerBalances and claimedAmounts
            buyerBalances[sellToken][buyToken][user][auctionIndex] = 0;
            claimedAmounts[sellToken][buyToken][user][auctionIndex] = 0;

            // Assign extra tokens (this is possible only after auction has cleared,
            // because buyVolume could still increase before that)
            uint buyerBalance = buyerBalances[sellToken][buyToken][user][auctionIndex];
            uint extraTokensTotal = extraSellTokens[sellToken][buyToken][auctionIndex];
            uint extraTokens = buyerBalance * extraTokensTotal / buyVolumes[sellToken][buyToken][auctionIndex];
            returned += extraTokens;
        }

        // Claim tokens
        balances[sellToken][user] += returned;
        NewBuyerFundsClaim(sellToken, buyToken, user, auctionIndex, returned);
    }

    /// @dev Claim buyer funds for one auction
    function getUnclaimedBuyerFunds(
        address sellToken,
        address buyToken,
        address user,
        uint auctionIndex
    )
        public
        constant
        returns (uint unclaimedBuyerFunds)
    {
        // Checks if particular auction has ever run
        require(auctionIndex <= latestAuctionIndices[sellToken][buyToken]);

        uint buyerBalance = buyerBalances[sellToken][buyToken][user][auctionIndex];

        if (buyerBalance == 0) {
            unclaimedBuyerFunds = 0;
        } else {
            uint num;
            uint den;
            (num, den) = getPrice(sellToken, buyToken, auctionIndex);

            if (num <= 0) {
                // Actually this should never happen - as long as there is >= 1 buy order,
                // auction will clear before price = 0. So this is just fail-safe
                unclaimedBuyerFunds = 0;
            } else {
                unclaimedBuyerFunds = buyerBalance * den / num - claimedAmounts[sellToken][buyToken][user][auctionIndex];
            }
        }
    }

    function getPrice(
        address sellToken,
        address buyToken,
        uint auctionIndex
    )
        public
        constant
        returns (uint num, uint den)
    {
        // Check if auction has been initialised
        require(auctionIndex <= latestAuctionIndices[sellToken][buyToken]);

        if (auctionIndex < latestAuctionIndices[sellToken][buyToken]) {
            // Auction has closed
            fraction memory closingPrice = closingPrices[sellToken][buyToken][auctionIndex];
            num = closingPrice.num;
            den = closingPrice.den;
        } else {
            // Next we calculate current price by first getting the last closing price
            fraction memory lastClosingPrice = closingPrices[sellToken][buyToken][auctionIndex - 1];
            uint numOfLastClosingPrice = lastClosingPrice.num;
            uint denOfLastClosingPrice = lastClosingPrice.den;

            // If the previous closing price was 0, for calculations we assume it was
            // 10% of the closing price of the last auction that closed above 0
            if (numOfLastClosingPrice <= 0) {
                fraction memory previousClosingPrice;
                uint i = 1;

                while (numOfLastClosingPrice <= 0) {
                    i++;
                    previousClosingPrice = closingPrices[sellToken][buyToken][auctionIndex - i];
                    numOfLastClosingPrice = previousClosingPrice.num;
                }

                denOfLastClosingPrice = previousClosingPrice.den * 10;
            }

            uint timeElapsed = now - auctionStarts[sellToken][buyToken];

            // The numbers below are chosen such that
            // P(0 hrs) = 2 * lastClosingPrice, P(6 hrs) = lastClosingPrice, P(24 hrs) = 0
            num = (86400 - timeElapsed) * numOfLastClosingPrice;
            den = (timeElapsed + 43200) * denOfLastClosingPrice;

            num = Math.max(num, 0);
        }
    }

    function clearAuction(
        address sellToken,
        address buyToken,
        uint currentPriceNum,
        uint currentPriceDen
    )
        internal
    {
        uint latestAuctionIndex = latestAuctionIndices[sellToken][buyToken];

        buyVolumes[sellToken][buyToken][latestAuctionIndex]+=extraBuyTokens[sellToken][buyToken] ;
        sellVolumes[sellToken][buyToken][latestAuctionIndex]+=extraSellTokens[sellToken][buyToken];
        // Update extra tokens
        extraBuyTokens[sellToken][buyToken] = 0;
        extraSellTokens[sellToken][buyToken] = 0;

        // Update other state variables
        closingPrices[sellToken][buyToken][latestAuctionIndex].num = currentPriceNum;
        closingPrices[sellToken][buyToken][latestAuctionIndex].den = currentPriceDen;
        latestAuctionIndices[sellToken][buyToken] = latestAuctionIndex + 1;

        AuctionCleared(sellToken, buyToken, latestAuctionIndex - 1);
        waitOrScheduleNextAuction(sellToken, buyToken,latestAuctionIndex);
    }

    function waitOrScheduleNextAuction(address sellToken,address buyToken,uint latestAuctionIndex) internal
    {

      if (sellVolumes[sellToken][buyToken][latestAuctionIndex + 1] == 0 ) {
          // No sell orders were submitted
          // First sell order will notice this and push auction state into waiting period -> auctionStarts[sellToken][buyToken] = 1;
          auctionStarts[sellToken][buyToken] = 0;
      } else{
        // putting auction in waiting state for ReziproAuction
        auctionStarts[sellToken][buyToken] = 1;
      }
      // If both Auctions are waiting, start them in 1 hour and clear all states
      if(auctionStarts[sellToken][buyToken] = 1 && auctionStarts[buyToken][sellToken] = 1){ // Maybe or is wanted by design
        //set starting point in 1 hour
        auctionStarts[buyToken][sellToken] = now+3600;
        auctionStarts[sellToken][buyToken] = now+3600;
      }
    }


    function calculateFee(
        address sellToken,
        address buyToken,
        address user,
        uint amount,
        uint amountOfWIZBurnedSubmitted
    )
        internal
        returns (uint fee)
    {
        // Calculate fee based on proportion of all TUL tokens owned
        uint supplyOfTUL = TUL.getTotalSupply();
        uint balanceOfTUL = TUL.balanceOf(user);

        // The fee function is chosen such that
        // F(0) = 0.5%, F(1%) = 0.25%, F(>=10%) = 0
        // (Takes in my ratio of all TUL tokens, outputs fee ratio)
        // We then multiply by amount to get fee:
        fee = (supplyOfTUL - 10 * balanceOfTUL) * amount / (16000 * balanceOfTUL + 200 * supplyOfTUL);
        fee = Math.max(fee, 0);

        if (fee > 0) {
            // Allow user to reduce up to half of the fee with WIZ

            // Convert fee to ETH, then USD
            uint feeInETH = priceOracles[buyToken].convert(fee);
            uint feeInUSD = ETHUSDOracle.convert(feeInETH);
            uint amountOfWIZBurned = Math.min(amountOfWIZBurnedSubmitted, feeInUSD / 2);
            // ERC-20
            WIZ.spend(user, amountOfWIZBurned);

            // Adjust fee
            fee = amountOfWIZBurned * fee / feeInUSD;
        }
    }
}
