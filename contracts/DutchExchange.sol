pragma solidity 0.4.18;

import "./Utils/Math.sol";
import "./Tokens/Token.sol";
import "./Oracle/PriceOracleInterface.sol";  

/// @title Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - <dominik@gnosis.pm>
    
    
contract DutchExchange {
    using Math for *;
    
    // The price is a rational number, so we need a concept of a fraction
    struct fraction {
        uint num;
        uint den;
    }

    address public owner;
    // Ether ERC-20 token
    address public ETH;
    address public TUL;
    address public OWL;
    address public priceOracleAddress;

    // Token => approved
    // Only tokens approved by owner generate TUL tokens
    mapping (address => bool) public approvedTokens;


    // The following three mappings are symmetric - m[t1][t2] = m[t2][t1]

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
    /// @param _owner will be the admin of the contract
    /// @param _ETH - address of ETH ERC-20 token
    /// @param _TUL - address of TUL ERC-20 token
    /// @param _OWL - address of OWL ERC-20 token
    function DutchExchange(
        address _owner, 
        address _ETH,
        address _priceOracleAddress,
        address _TUL,
        address _OWL
    )
        public
    {
        owner = _owner;
        ETH = _ETH;
        priceOracleAddress = _priceOracleAddress;
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
        address _priceOracleAddress
    )
        public
        onlyOwner()
    {
        priceOracleAddress = _priceOracleAddress;
    }
    
    /// @param initialClosingPriceNum initial price will be 2 * initialClosingPrice. This is its numerator
    /// @param initialClosingPriceDen initial price will be 2 * initialClosingPrice. This is its denominator
    function addTokenPair(
        address token1,
        address token2,
        uint token1Funding,
        uint token2Funding,
        uint initialClosingPriceNum,
        uint initialClosingPriceDen,
        uint token1Funding,
        uint token2Funding
    )
        public
    {
        //TODO 
        ///check that token has not already been added

        // Price can't be negative, 0, and has to be bounded
        require(initialClosingPriceNum != 0);
        require(initialClosingPriceDen != 0);
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

        uint fundedValueUSD;
        uint latestAuctionIndex = latestAuctionIndices[token1][token2];

        // ETH-Token pairs must have ETH as first argument
        require(token2 != ETH);

        if (token1 == ETH) {
            fundedValueUSD = token1Funding * PriceOracleInterface(priceOracleAddress).getUSDETHPrice();  
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
            fundedValueUSD = PriceOracleInterface(priceOracleAddress).getTokensValueInCENTS(token1, token1Funding)+PriceOracleInterface(priceOracleAddress).getTokensValueInCENTS(token2, token2Funding);
        }

        if (latestAuctionIndex > 0) {
            // Token pair has run at some point in the past
            // Sell funding must be at least $1000
            require(fundedValueUSD >= 1000);
        } else {
            // Token pairs have to either be new,
            // or (if it is renewing), be in same order as before
            require(latestAuctionIndices[token2][token1] == 0);

            // Now we can be sure it is a new pair
            // In that case, we require sell funding to be at least $10,000
            require(fundedValueUSD >= 10000);
        }

        require(Token(token1).transferFrom(msg.sender, this, token1Funding));
        require(Token(token2).transferFrom(msg.sender, this, token2Funding));

        // Update variables
        sellVolumes[token1][token2][latestAuctionIndex + 1] = token1Funding;
        sellVolumes[token2][token1][latestAuctionIndex + 1] = token2Funding;

        auctionStarts[token1][token2] = now + 6 * 1 hours;

        // Save prices of reverse auctions
        fraction memory initialClosingPrice = fraction(initialClosingPriceNum, initialClosingPriceDen);
        closingPrices[token1][token2][0] = initialClosingPrice;

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
        uint amountSubmitted
    )
        public
        existingTokenPair(sellToken, buyToken)
    {
        // Requirements
        uint latestAuctionIndex = latestAuctionIndices[sellToken][buyToken];

        require(auctionIndex == latestAuctionIndex+1 || (auctionStarts[sellToken][buyToken] >= now && auctionIndex == latestAuctionIndex));
        
        uint amount = Math.min(amountSubmitted, balances[sellToken][msg.sender]);

        require(amount > 0);

        // Fee mechanism
        uint fee = calculateFee(sellToken, buyToken, msg.sender, amount);
        // Fees are added to extraSellTokens -> current auction in the edge cases,
        // next auction in the majority case
        extraSellTokens[sellToken][buyToken][auctionIndex] += fee;
        uint amountAfterFee = amount - fee;

        // Update variables
        balances[sellToken][msg.sender] -= amount;
        sellerBalances[sellToken][buyToken][auctionIndex][msg.sender] += amountAfterFee;
        sellVolumes[sellToken][buyToken][auctionIndex] += amountAfterFee;
        // look up whehter a new Auction can be started with the new Sell vollume
        waitOrScheduleNextAuction(sellToken, buyToken, auctionIndex);

        //Event
        NewSellOrder(sellToken, buyToken, msg.sender, auctionIndex, amount);
    }

    function postBuyOrder(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint amount
    )
        public
        existingTokenPair(sellToken, buyToken)
    {
        
        // Requirements
        require(auctionStarts[sellToken][buyToken] >= now);
        require(auctionIndex == latestAuctionIndices[sellToken][buyToken]);

        amount = Math.min(amount, balances[buyToken][msg.sender]);


        // Fee mechanism
        uint fee = calculateFee(sellToken, buyToken, msg.sender, amount);
        // Fees are always added to next auction
        extraBuyTokens[sellToken][buyToken][auctionIndex + 1] += fee;
        uint amountAfterFee = amount - fee;
        
        // Overbuy is when a part of a buy order clears an auction
        // In that case we only priceOracleAddress the part before the overbuy
        // To calculate overbuy, we first get current price
        uint num;
        uint den;
        (num, den) = getPrice(sellToken, buyToken, auctionIndex);


        checkArbitragePossibilityInOppositeMarket(auctionIndex, sellToken, buyToken, num, den);
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
            NewBuyOrder(sellToken, buyToken, msg.sender, auctionIndex, amount);
        }

        if (overbuy >= 0) {
            // Clear auction
            clearAuction(sellToken, buyToken, auctionIndex);
        }
    }

    function checkArbitragePossibilityInOppositeMarket(
        uint auctionIndex,
        address sellToken,
        address buyToken,
        uint num,
        uint den
    )
    internal
    {
      // Check whether OppositeAuction already closed:
        if ((closingPrices[sellToken][buyToken][auctionIndex]).den == 0) {
            fraction memory lastClosingPrice = closingPrices[sellToken][buyToken][auctionIndex - 1];
            uint numLastAuction= lastClosingPrice.num;
            uint denLastAuction= lastClosingPrice.den;

            // Check wheter there is an arbitrage possibility
            if (num*denLastAuction < den*numLastAuction) {
                  //calculate outstanding volumes for both markets at time of priceCrossing:
                int missingVolume = int(buyVolumes[sellToken][buyToken][auctionIndex] - sellVolumes[sellToken][buyToken][auctionIndex] * numLastAuction / denLastAuction);
                int missingVolumeOpposite = int(buyVolumes[buyToken][sellToken][auctionIndex] - sellVolumes[buyToken][sellToken][auctionIndex] * denLastAuction/numLastAuction) * int(numLastAuction) / int(denLastAuction);

                  // fill up the Auction with smaller missing volume
                if (missingVolume > 0 && missingVolumeOpposite > 0) {
                    if (missingVolumeOpposite < missingVolume) {
                        fillUpOppositeAuction(sellToken, buyToken, uint(missingVolumeOpposite), numLastAuction, denLastAuction, auctionIndex);
                    } else {
                        fillUpOppositeAuction(buyToken, sellToken, uint(missingVolume)*denLastAuction/numLastAuction, denLastAuction, numLastAuction, auctionIndex);
                    }
                } else {
                    //edge cases where the last BuyOrder were not enough to fill the sell order,
                    // but then price decreased laster and with the later price, acutally it would have been enough
                    if (missingVolume <= 0) {
                        clearAuction(sellToken, buyToken, auctionIndex);
                    }
                    if (missingVolumeOpposite <= 0) {
                        clearAuction(buyToken, sellToken, auctionIndex);
                    }
                }
            }
            if (missingVolumeOpposite <= 0) {
                clearAuction(buyToken, sellToken, auctionIndex);
            }
        }
    }


    function fillUpOppositeAuction(
        address sellToken,
        address buyToken,
        uint volume,
        uint numClearing,
        uint denClearing,
        uint auctionIndex
    )
    internal
    {
        sellVolumes[sellToken][buyToken][auctionIndex] -= volume;
        buyVolumes[buyToken][sellToken][auctionIndex] += volume * denClearing / numClearing;
        clearAuction(sellToken, buyToken, auctionIndex);
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
            fraction memory lastClosingPrice2 = closingPrices[buyToken][sellToken][auctionIndex - 1];
            
            uint numOfLastClosingPrice = (lastClosingPrice.num + lastClosingPrice2.den)/2;
            uint denOfLastClosingPrice = (lastClosingPrice.den + lastClosingPrice2.num)/2;

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
            // P(0 hrs) = 2 * lastClosingPrice, P(6 hrs) = lastClosingPrice, P(24 hrs) = 0
            num = (86400 - timeElapsed) * numOfLastClosingPrice;
            // P(0 hrs) = 2 * lastClosingPrice, P(6 hrs) = lastClosingPrice, P(>=24 hrs) = 0
            num = Math.max(0, 86400 - timeElapsed) * numOfLastClosingPrice;
            den = (timeElapsed + 43200) * denOfLastClosingPrice;
        }
    }

    ///@dev clears an Auction
    ///@param sellToken sellToken of the auction
    ///@param buyToken  buyToken of the auction
    ///@param auctionIndex of the auction to be cleared.
    function clearAuction(
        address sellToken,
        address buyToken,
        uint auctionIndex
    )
        internal
    {

        // set the final prices as average from both auctions: usual auction + opposite auction
        closingPrices[sellToken][buyToken][auctionIndex].num = (buyVolumes[sellToken][buyToken][auctionIndex]);
        closingPrices[sellToken][buyToken][auctionIndex].den = (sellVolumes[sellToken][buyToken][auctionIndex]);


        // increasing to next auction
        auctionStarts[sellToken][buyToken] = 0;

        AuctionCleared(sellToken, buyToken, auctionIndex);
        waitOrScheduleNextAuction(sellToken, buyToken, auctionIndex+1);
    }

    uint public tresholdInUSD=1000;

    ///@dev checks whether the next auction and opposite auction can be started
    ///@param sellToken sellToken of the auction
    ///@param buyToken  buyToken of the auction
    ///@param auctionIndex to check for an subsequent auction.
    function waitOrScheduleNextAuction(
        address sellToken,
        address buyToken,
        uint auctionIndex
    )
        internal
    {
        // auctionStarts[sellToken][buyToken]>1 -> auction is running
        // auctionStarts[sellToken][buyToken]==0 -> auction is waiting for bids
        // auctionStarts[sellToken][buyToken]==1 -> auction is waiting for OppositeAuction


         // should we use a treshold instead of !=0 ? 
         //uint public tresholdForStartingAuction=10
        if( auctionStarts[sellToken][buyToken] == 0) {   
            uint tresholdVolume=PriceOracleInterface(priceOracleAddress).getTokensValueInCENTS(sellToken, sellVolumes[sellToken][buyToken][auctionIndex]);
            if (tresholdVolume/100 > tresholdInUSD) {
                // putting auction in waiting state for OppositeAuction
                auctionStarts[sellToken][buyToken] = 1;
            }
        }
        // do not start auctions, if no auction has reached the treshold or one auction is still running
        if ((auctionStarts[sellToken][buyToken] == 1 && auctionStarts[buyToken][sellToken] < 2) || (auctionStarts[sellToken][buyToken] < 2 && auctionStarts[buyToken][sellToken] == 1)) { 

            
            
            if (auctionStarts[sellToken][buyToken] == 1) {
                // Update extra tokens
                buyVolumes[sellToken][buyToken][auctionIndex] += extraBuyTokens[sellToken][buyToken][auctionIndex-1];
                sellVolumes[sellToken][buyToken][auctionIndex] += extraSellTokens[sellToken][buyToken][auctionIndex-1];
            
                extraBuyTokens[sellToken][buyToken][auctionIndex-1] = 0;
                extraSellTokens[sellToken][buyToken][auctionIndex-1] = 0;
                
                //set starting point in 10 minutes
                auctionStarts[buyToken][sellToken] = now+600;

            } 

            if (auctionStarts[buyToken][sellToken] == 1) {
                // Update extra tokens
                buyVolumes[buyToken][sellToken][auctionIndex] += extraBuyTokens[buyToken][sellToken][auctionIndex-1];
                sellVolumes[buyToken][sellToken][auctionIndex] += extraSellTokens[buyToken][sellToken][auctionIndex-1];

                extraBuyTokens[buyToken][sellToken][auctionIndex-1] = 0;
                extraSellTokens[buyToken][sellToken][auctionIndex-1] = 0;
                //set starting point in 10 minutes
                auctionStarts[sellToken][buyToken] = now+600;
            }

                // update latest auctions
                latestAuctionIndices[buyToken][sellToken] += 1;

                // update latest auctions
                latestAuctionIndices[sellToken][buyToken] += 1;
        }
    }


    function calculateFee(
        address sellToken,
        address buyToken,
        address user,
        uint amount
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
            uint amountOfWIZBurned = Math.min(Token(OWL).allowance(msg.sender, this), PriceOracleInterface(priceOracleAddress).getTokensValueInCENTS(buyToken, fee)/100);

            //burning OWL tokens with delegatecall is risky, because this allows OWL token to modify the storage of this contract.
            // OWL.delegatecall(bytes4(sha3("burnOWL(uint256)")), amount);


            // Adjust fee
            fee = amountOfWIZBurned;
        }
    }
    
    function getClosingPriceNum(
        address buyToken,
        address sellToken,
        uint auctionIndex
    )
        public 
        view
        returns (uint) 
    {
        return closingPrices[sellToken][buyToken][auctionIndex].num;
    }


    function getClosingPriceDen(
        address buyToken,
        address sellToken,
        uint auctionIndex
    )
        public 
        view
        returns (uint) 
    {
        return closingPrices[sellToken][buyToken][auctionIndex].num;
    } 

    function getLatestAuction(
        address buyToken,
        address sellToken
    )
        public 
        view
        returns (uint) 
    {
        return latestAuctionIndices[sellToken][buyToken];
    }
    
    /// @dev Gives best estimate for market price of a token in ETH of any price oracle on the Ethereum network
    /// @param token address of ERC-20 token
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
