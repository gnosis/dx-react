pragma solidity 0.4.18;

import "./Utils/Math.sol" as Math;
import "./Tokens/Token.sol";
import "./Oracle/PriceOracle.sol";  

/// @title Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - <dominik@gnosis.pm>
    
    
contract DutchExchange {

    // The price is a rational number, so we need a concept of a fraction
    struct fraction {
        uint num;
        uint den;
    }

    address public owner;
    // Ether ERC-20 token
    address public ETH;
    address public ETHUSDOracle;
    address public TUL;
    address public OWL;

    // Token => approved
    // Only tokens approved by owner generate TUL tokens
    mapping (address => bool) public approvedTokens;

    // The following two mappings are symmetric - m[t1][t2] = m[t2][t1]
    // The order depends on in which order the tokens were submitted in addTokenPair()
    // ETH-Token pairs will always have ETH first, T-T pairs will have arbitrary order 
    // Token => Token => index
    mapping (address => mapping (address => uint)) public latestAuctionIndices;
    // Token => Token => time
    mapping (address => mapping (address => uint)) public auctionStarts;

    // Token => Token => auctionIndex => price
    mapping (address => mapping (address => mapping (uint => fraction))) public closingPrices;

    // Token => user => amount
    // balances stores a user's balance in the DutchX
    mapping (address => mapping (address => uint)) public balances;

    // Token => Token => auctionIndex => amount
    // We store historical values, because they are necessary to calculate extraTokens
    mapping (address => mapping (address => mapping (uint => uint))) public sellVolumes;
    mapping (address => mapping (address => mapping (uint => uint))) public buyVolumes;

    // Token => Token => auctionIndex => amount
    mapping (address => mapping (address => mapping (uint => uint))) public extraSellTokens;
    mapping (address => mapping (address => mapping (uint => uint))) public extraBuyTokens;

    // Token => Token =>  auctionIndex => user => amount
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
        require(latestAuctionIndices[ETH][token] > 0);
        _;
    }

    modifier existingTokenPair(address sellToken, address buyToken) {
        require(latestAuctionIndices[sellToken][buyToken] > 0);
        _;
    }

    /// @dev Constructor creates exchange
    /// @param _owner
    /// @param _ETH - address of ETH ERC-20 token
    /// @param _ETHUSDOracle
    /// @param _TUL - address of TUL ERC-20 token
    /// @param _OWL - address of OWL ERC-20 token
    function DutchExchange(
        address _owner, 
        address _ETH,
        address _ETHUSDOracle,
        address _TUL,
        address _OWL
    )
        public
    {
        owner = _owner;
        ETH = _ETH;
        ETHUSDOracle = _ETHUSDOracle;
        TUL = _TUL;
        OWL = _OWL;
    }

    function updateOwner(
        address newOwner
    )
        public
        onlyOwner()
    {
        owner = newOwner;
    }

    function updateApprovalOfToken(
        address token,
        bool approved
    )
        public
        onlyOwner()
    {
        approvedTokens[token] = approved;
    }

    function updateETHUSDPriceOracle(
        address _ETHUSDOracle
    )
        public
        onlyOwner()
    {
        ETHUSDOracle = _ETHUSDOracle;
    }

    /// @param token1. For ETH-Token pairs, this has to be ETH ERC-20 token
    /// @param token2
    /// @param initialClosingPriceNum initial price will be 2 * initialClosingPrice. This is its numerator
    /// @param initialClosingPriceDen initial price will be 2 * initialClosingPrice. This is its denominator
    function addTokenPair(
        address token1,
        address token2,
        uint initialClosingPriceNum,
        uint initialClosingPriceDen,
        uint token1Funding,
        uint token2Funding
    )
        public
    {
        // Price can't be negative, 0, and has to be bounded
        require(initialClosingPriceNum != 0);
        require(initialClosingPriceDen != 0);

        uint fundedValueUSD;
        uint ETHUSDPrice = ETHUSDOracle.getETHUSDPrice();
        uint latestAuctionIndex = latestAuctionIndices[token1][token2];

        // ETH-Token pairs must have ETH as first argument
        require(token2 != ETH);

        if (token1 == ETH) {
            fundedValueUSD = token1Funding * ETHUSDPrice;
        } else {
            // Neither token is ETH
            // We require there to exist ETH-Token auctions
            require(latestAuctionIndices[ETH][token1] > 0);
            require(latestAuctionIndices[ETH][token2] > 0);

            // Price of Token 1
            uint priceToken1Num;
            uint priceToken1Den;
            (priceToken1Num, priceToken1Den) = priceOracle(token1);

            // Price of Token 2
            uint priceToken2Num;
            uint priceToken2Den;
            (priceToken2Num, priceToken2Den) = priceOracle(token2);

            // Compute funded value in ETH and USD
            uint fundedValueETH = token1Funding * priceToken1Num / priceToken1Den + token2Funding * priceToken2Num / priceToken2Den;
            fundedValueUSD = fundedValueETH * ETHUSDPrice;
        }

        if (latestAuctionIndex > 0) {
            // Token pair has run at some point in the past
            // Sell funding must be at least $1000
            require(fundedValueUSD >= 1000);
        } else {
            // Token pairs have to either be new,
            // or (if it is renewing), be in same order as before
            require(latestAuctionIndices[token2][token1] == 0)

            // Now we can be sure it is a new pair
            // In that case, we require sell funding to be at least $10,000
            require(fundedValueUSD >= 10000);
        }

        require(Token(token1).transferFrom(token1Funding));
        require(Token(token2).transferFrom(token2Funding));

        // Update variables
        sellVolumes[token1][token2][latestAuctionIndex + 1] = token1Funding;
        sellVolumes[token2][token1][latestAuctionIndex + 1] = token2Funding;

        auctionStarts[token1][token2] = now + 6 * 1 hours;

        // Save prices of opposite auctions
        fraction memory initialClosingPrice = fraction(initialClosingPriceNum, initialClosingPriceDen);
        closingPrices[token1][token2][latestAuctionIndex + 1] = initialClosingPrice;
        fraction memory initialClosingPriceOpposite = fraction(initialClosingPriceDen, initialClosingPriceNum);
        closingPrices[token2][token1][latestAuctionIndex + 1] = initialClosingPriceOpposite;

        // latestAuctionIndex has to go up by 2
        // If we were renewing a token pair, the next index will save the price
        // and the next index represents the scheduled auction
        latestAuctionIndices[token1][token2] = latestAuctionIndex + 2;
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
        // Requirements
        uint latestAuctionIndex = latestAuctionIndices[sellToken][buyToken];
        require(auctionIndex == latestAuctionIndex + 1);

        uint amount = Math.min(amountSubmitted, balances[sellToken][msg.sender]);

        require(amount > 0);

        // Fee mechanism
        uint fee = calculateFee(sellToken, buyToken, msg.sender, amount, amountOfWIZToBurn);
        // Fees are added to extraSellTokens
        extraSellTokens[sellToken][buyToken][auctionIndex] += fee;
        uint amountAfterFee = amount - fee;

        // Update variables
        balances[sellToken][msg.sender] -= amount;
        sellerBalances[sellToken][buyToken][auctionIndex][msg.sender] += amountAfterFee;
        sellVolumes[sellToken][buyToken][auctionIndex] += amountAfterFee;
        waitOrScheduleNextAuction(sellToken,buyToken,latestAuctionIndex);
        NewSellOrder(sellToken, buyToken, msg.sender, auctionIndex, amount);
    }

    function postBuyOrder(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint amount, // originally amountSubmitted
        uint amountOfWIZToBurn
    )
        public
        existingTokenPair(sellToken, buyToken)
    {
        // Requirements
        require(auctionStarts[sellToken][buyToken] >= now);
        require(auctionIndex == latestAuctionIndices[sellToken][buyToken]);

        checkArbitragePossibilityInOppositeMarket(auctionIndex,sellToken,buyToken);
        amount = Math.min(amount, balances[buyToken][msg.sender]);

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
        (num, den) = getPrice(sellToken,buyToken,auctionIndex);

        //uint sellVolume = sellVolumes[sellToken][buyToken][auctionIndex];
        //uint buyVolume = buyVolumes[sellToken][buyToken][auctionIndex];
        //int overbuy = int(buyVolume + amountAfterFee - sellVolume * num / den);
        int overbuy = int(buyVolumes[sellToken][buyToken][auctionIndex] + amountAfterFee 
            - sellVolumes[sellToken][buyToken][auctionIndex] * num / den);
        if (int(amountAfterFee) > overbuy) {
            // We must process the buy order
            if (overbuy > 0) {
                // We have to adjust the amount
                amountAfterFee -= uint(overbuy);
            }

            // Update variables
            balances[buyToken][msg.sender] -= amount;
            buyerBalances[sellToken][buyToken][auctionIndex][msg.sender] += amountAfterFee;
            buyVolumes[sellToken][buyToken][auctionIndex] += amountAfterFee;
            NewBuyOrder(sellToken,buyToken, msg.sender, auctionIndex, amount);
        }

        if (overbuy >= 0) {
            // Clear auction
            //uint finalBuyVolume = buyVolume + amountAfterFee - uint(overbuy);
            //clearAuction(sellToken, buyToken, buyVolumes[sellToken][buyToken][auctionIndex] + 
            // amountAfterFee - uint(overbuy) - sellVolumes[sellToken][buyToken][auctionIndex]);
        }
    }
    function checkArbitragePossibilityInOppositeMarket(uint auctionIndex, address sellToken, address buyToken) internal
    {
      // Check whether ReziproAuction already closed:
      if((closingPrices[sellToken][buyToken][auctionIndex]).den!=0)
      {
        uint num;
        uint den;
        (num, den) = getPrice(sellToken, buyToken, auctionIndex);
        fraction memory lastClosingPrice = closingPrices[sellToken][buyToken][auctionIndex - 1];
        uint numLastAuction= lastClosingPrice.num;
        uint denLastAuction= lastClosingPrice.den;

        // Check wheter there is an arbitrage possibility
        // num*denRezi<den*numRezi ensures that DutchAuction prices have crossed
        if (num * denLastAuction < den * numLastAuction) {
          //calculate outstanding volumes for both makets at time of priceCrossing:
          int missingVolume = int(buyVolumes[sellToken][buyToken][auctionIndex] - sellVolumes[sellToken][buyToken][auctionIndex] * numLastAuction / denLastAuction);
          int missingVolumeRezi = int(buyVolumes[buyToken][sellToken][auctionIndex]  
            - sellVolumes[buyToken][sellToken][auctionIndex] *  denLastAuction/numLastAuction)* int(numLastAuction) / int(denLastAuction);

          // fill up the Auction with smaller missing volume
          if( missingVolume>0 && missingVolumeRezi>0)
          {
              if(missingVolumeRezi<missingVolume){
                fillUpReziAuction(sellToken,buyToken,uint(missingVolumeRezi),numLastAuction,denLastAuction,auctionIndex);
              }
              else{
                fillUpReziAuction(buyToken,sellToken,uint(missingVolume),denLastAuction,numLastAuction,auctionIndex);
              }
          }
          else{
            //edge cases where the last BuyOrder were not enough to fill the sell order, 
            // 
            // but then price decreased laster and with the later price, acutally it would have been enough
            if(missingVolume<=0){
              clearAuction(sellToken, buyToken, auctionIndex);
            }
            if(missingVolumeRezi<=0){
              clearAuction(buyToken, sellToken, auctionIndex);
              }
          }
      }
      }
    }

    function fillUpReziAuction(
        address sellToken,
        address buyToken,
        uint volume, 
        uint numClearing, 
        uint denClearing,
        uint auctionIndex
    )
        internal
    {
        buyVolumes[sellToken][buyToken][auctionIndex] += volume;
        sellVolumes[sellToken][buyToken][auctionIndex] -= volume*denClearing/numClearing;
        clearAuction(sellToken , buyToken,  auctionIndex);
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
        uint256 sellerBalance = sellerBalances[sellToken][buyToken][auctionIndex][user];
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
        sellerBalances[sellToken][buyToken][auctionIndex][user] = 0;
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
            claimedAmounts[sellToken][buyToken][auctionIndex][user] += returned;
        } else {
            // Auction has closed
            // Reset buyerBalances and claimedAmounts
            buyerBalances[sellToken][buyToken][auctionIndex][user] = 0;
            claimedAmounts[sellToken][buyToken][auctionIndex][user] = 0;

            // Assign extra tokens (this is possible only after auction has cleared,
            // because buyVolume could still increase before that)
            uint buyerBalance = buyerBalances[sellToken][buyToken][auctionIndex][user];
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

        uint buyerBalance = buyerBalances[sellToken][buyToken][auctionIndex][user];

        uint num;
        uint den;
        (num, den) = getPrice(sellToken, buyToken, auctionIndex);

        if (num == 0) {
            // This should never happen - as long as there is >= 1 buy order,
            // auction will clear before price = 0. So this is just fail-safe
            unclaimedBuyerFunds = 0;
        } else {
            unclaimedBuyerFunds = buyerBalance * den / num - claimedAmounts[sellToken][buyToken][auctionIndex][user];
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
            if (numOfLastClosingPrice == 0) {
                fraction memory previousClosingPrice;
                uint i = 1;

                while (numOfLastClosingPrice == 0) {
                    i++;
                    previousClosingPrice = closingPrices[sellToken][buyToken][auctionIndex - i];
                    numOfLastClosingPrice = previousClosingPrice.num;
                }

                denOfLastClosingPrice = previousClosingPrice.den * 10;
            }

            // If we're calling the function into an unstarted auction,
            // it will return the starting price of that auction
            uint timeElapsed = Math.max(0, now - auctionStarts[sellToken][buyToken]);

            // The numbers below are chosen such that
            // P(0 hrs) = 2 * lastClosingPrice, P(6 hrs) = lastClosingPrice, P(>=24 hrs) = 0
            num = Math.max(0, 86400 - timeElapsed) * numOfLastClosingPrice);
            den = (timeElapsed + 43200) * denOfLastClosingPrice;
        }
    }

    function clearAuction(
        address sellToken,
        address buyToken,
        uint auctionIndex
    )
        internal
    {

        buyVolumes[sellToken][buyToken][auctionIndex+1]+=extraBuyTokens[sellToken][buyToken] [auctionIndex];
        sellVolumes[sellToken][buyToken][auctionIndex+1]+=extraSellTokens[sellToken][buyToken][auctionIndex];
        // Update extra tokens
        extraBuyTokens[sellToken][buyToken][auctionIndex] = 0;
        extraSellTokens[sellToken][buyToken][auctionIndex] = 0;

        // Update other state variables
        // not yet correct....
        closingPrices[sellToken][buyToken][auctionIndex].num 
        = (buyVolumes[sellToken][buyToken][auctionIndex]+buyVolumes[buyToken][sellToken][auctionIndex])/2;
        closingPrices[sellToken][buyToken][auctionIndex].den 
        = (sellVolumes[sellToken][buyToken][auctionIndex]+sellVolumes[sellToken][buyToken][auctionIndex])/2;
        latestAuctionIndices[sellToken][buyToken] = auctionIndex + 1;

        AuctionCleared(sellToken, buyToken, auctionIndex - 1);
        waitOrScheduleNextAuction(sellToken, buyToken,auctionIndex);
    }

    function waitOrScheduleNextAuction(
        address sellToken,
        address buyToken,
        uint latestAuctionIndex
    )
        internal
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
        if(auctionStarts[sellToken][buyToken] == 1 && auctionStarts[buyToken][sellToken] == 1){ // Maybe or is wanted by design
          //set starting point in 10 minutes
          auctionStarts[buyToken][sellToken] = now+600;
          auctionStarts[sellToken][buyToken] = now+600;
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
        uint supplyOfTUL = Token(TUL).totalSupply();
        uint balanceOfTUL = Token(TUL).balanceOf(user);

        // The fee function is chosen such that
        // F(0) = 0.5%, F(1%) = 0.25%, F(>=10%) = 0
        // (Takes in my ratio of all TUL tokens, outputs fee ratio)
        // We then multiply by amount to get fee:
        fee = Math.max(0, (supplyOfTUL - 10 * balanceOfTUL) * amount / (16000 * balanceOfTUL + 200 * supplyOfTUL));

        if (fee > 0) {
            // Allow user to reduce up to half of the fee with WIZ

            // Convert fee to ETH, then USD
            uint feeInETH = PriceOracle(ETHUSDOracle).getETHvsTokenPrice(buyToken)*(fee);
            uint feeInUSD = feeInETH * PriceOracle(ETHUSDOracle).getETHUSDPrice();
            uint amountOfWIZBurned = Math.min(amountOfWIZBurnedSubmitted, feeInUSD / 2);

            //burning OWL tokens with delegatecall is risky, because this allows OWL token to modify the storage of this contract.
            // OWL.delegatecall(bytes4(sha3("burnOWL(uint256)")), amount);


            // Adjust fee
            fee = amountOfWIZBurned * fee / feeInUSD;
        }
    }

    /// @dev Gives best estimate for market price of a token in ETH of any price oracle on the Ethereum network
    /// @param address of ERC-20 token
    /// @return Weighted average of closing prices of opposite Token-ETH auctions, based on their sellVolume  
    function priceOracle(
        address token
    )
        public
        constant
        existingToken(token)
        returns (uint num, uint den)
    {
        // Get variables
        uint latestAuctionIndex = latestAuctionIndices[ETH][token];
        fraction memory closingPriceETH = closingPrices[ETH][token][latestAuctionIndex - 1];
        fraction memory closingPriceToken = closingPrices[token][ETH][latestAuctionIndex - 1];

        // We will compute weighted average by considering ETH value of both auctions
        uint sellVolumeETH = sellVolumes[ETH][token][latestAuctionIndex - 1];
        uint buyVolumeToken = buyVolumes[token][ETH][latestAuctionIndex - 1];

        // Compute weighted average
        uint numFirstPart = sellVolumeETH * closingPriceETH.den * closingPriceToken.den;
        uint numSecondPart = buyVolumeToken * closingPriceToken.num * closingPriceETH.num;
        num = numFirstPart + numSecondPart;
        den = closingPriceETH.num * closingPriceToken.den * (sellVolumeETH + buyVolumeToken);
    }
}
