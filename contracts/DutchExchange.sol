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

    struct unlockedTUL {
        uint amout,
        uint withdrawalTime
    }

    address public owner;
    // Ether ERC-20 token
    address public ETH;
    address public ETHUSDOracle;
    // Minimum required sell funding for adding a new token pair, in USD
    address public sellFundingNewTokenPair;
    // Minimum required sell funding for renewing a token pair, in USD
    address public sellFundingRenewTokenPair;
    address public TUL;
    address public OWL;

    // Token => approved
    // Only tokens approved by owner generate TUL tokens
    mapping (address => bool) public approvedTokens;

    // We define a "token combination" to be a token tuple where order doesn't matter,
    // And "token pair" to be a tuple where order matters.
    // The following three mappings are for a token combination
    // The specific order depends on the order of the arguments passed to addTokenPair() (see below) 
    // Token => Token => index
    mapping (address => mapping (address => uint)) public latestAuctionIndices;
    // Token => Token => time
    mapping (address => mapping (address => uint)) public auctionStarts;
    // Token => Token => amount
    mapping (address => mapping (address => uint)) public arbTokensAdded;

    // Token => Token => auctionIndex => price
    mapping (address => mapping (address => mapping (uint => fraction))) public closingPrices;

    // Token => user => amount
    // balances stores a user's balance in the DutchX
    mapping (address => mapping (address => uint)) public balances;

    // user => unlockedTUL
    mapping (address => unlockedTUL) public unlockedTULs;
    // user => amount
    mapping (address => uint) public lockedTULBalances;

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

    /// @dev Constructor creates exchange
    /// @param _TUL - address of TUL ERC-20 token
    /// @param _OWL - address of OWL ERC-20 token
    /// @param _owner
    /// @param _ETH - address of ETH ERC-20 token
    /// @param _ETHUSDOracle
    /// @param Minimum required sell funding for adding a new token pair, in USD
    /// @param Minimum required sell funding for renewing a token pair, in USD
    function DutchExchange(
        address _TUL,
        address _OWL
        address _owner, 
        address _ETH,
        address _ETHUSDOracle,
        uint _sellFundingNewTokenPair,
        uint _sellFundingRenewTokenPair
    )
        public
    {
        TUL = _TUL;
        OWL = _OWL;
        owner = _owner;
        ETH = _ETH;
        ETHUSDOracle = _ETHUSDOracle;
        sellFundingNewTokenPair = _sellFundingNewTokenPair;
        sellFundingRenewTokenPair = _sellFundingRenewTokenPair;
    }

    function updateExchangeParams(
        address _owner,
        address _ETHUSDOracle,
        uint _sellFundingNewTokenPair,
        uint _sellFundingRenewTokenPair
    )
        public
        onlyOwner()
    {
        owner = _owner;
        ETHUSDOracle = _ETHUSDOracle,
        sellFundingNewTokenPair = _sellFundingNewTokenPair;
        sellFundingRenewTokenPair = _sellFundingRenewTokenPair;
    }

    function updateTULOwner(
        address _owner
    )
        public
        onlyOwner()
    {
        TokenTUL(TUL).updateOwner(_owner);
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

        // If we are adding or renewing a token pair, in both cases:
        require(latestAuctionIndices[token2][token1] == 0);

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
            require(fundedValueUSD >= sellFundingRenewTokenPair);
        } else {
            // Now we can be sure it is a new pair
            require(fundedValueUSD >= sellFundingNewTokenPair);
        }

        require(Token(token1).transferFrom(msg.sender, this, token1Funding));
        require(Token(token2).transferFrom(msg.sender, this, token2Funding));

        // Save prices of opposite auctions
        closingPrices[token1][token2][latestAuctionIndex] = fraction(initialClosingPriceNum, initialClosingPriceDen);
        closingPrices[token2][token1][latestAuctionIndex] = fraction(initialClosingPriceDen, initialClosingPriceNum);

        // Update other variables
        sellVolumes[token1][token2][latestAuctionIndex + 1] = token1Funding;
        sellVolumes[token2][token1][latestAuctionIndex + 1] = token2Funding;
        latestAuctionIndices[token1][token2] += 1;
        auctionStarts[token1][token2] = now + 6 hours;
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

    /// @dev Lock TUL
    function lockTUL()
        public
    {
        // Transfer maximum number
        uint allowance = Token(TUL).allowance(msg.sender, this);
        require(Token(TUL).transferFrom(msg.sender, this, allowance));

        lockedTULBalances[msg.sender] += allowance;
    }

    function unlockTUL(
        uint amount
    )
        public
    {
        amount = Math.min(amount, lockedTULBalances[msg.sender]);
        lockedTULBalances[msg.sender] -= amount;
        unlockedTULs[msg.sender].amount =+ amount;
        unlockedTULs[msg.sender].withdrawalTime = now + 24 hours;
    }

    function withdrawTUL()
        public
    {
        unlockedTUL memory unlocked = unlockedTULs[msg.sender];
        require(unlocked.withdrawalTime >= now);
        Token(TUL).transfer(msg.sender, unlocked.amount);
    }

    function postSellOrder(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint amountSubmitted,
        uint amountOfWIZToBurn
    )
        public
    {
        // Must be a valid token pair
        address token1;
        address token2;
        bool validTokenPair;
        (validTokenPair, token1, token2) = checkTokenPairAndOrder(sellToken, buyToken);
        require(validTokenPair);

        // Amount mmust be > 0
        amount = Math.min(amount, balances[sellToken][msg.sender]);
        require(amount > 0);

        uint latestAuctionIndex = latestAuctionIndices[token1][token2];
        if (now < auctionStarts[token1][token2]) {
            // We are in the 10 minute buffer period (or 6 hours for new token pair)
            // Auction has already cleared, and index has been incremented
            // Sell order must use that auction index
            require(auctionIndex == latestAuctionIndex);
        } else {
            // Sell orders must go to next auction
            require(auctionIndex == latestAuctionIndex + 1);

            // If there exist closing prices for both last auctions that means
            // 0 sell orders were received in both auctions and trading has halted
            // In that case don't accept sell orders until addTokenPair() is called
            uint closingPriceDen = closingPrices[sellToken][buyToken][auctionIndex - 1].den;
            uint closingPriceDenOpp = closingPrices[buyToken][sellToken][auctionIndex - 1].den;
            require(closingPriceDen == 0 || closingPriceDenOpp == 0);
        }

        // Fee mechanism, fees are added to extraSellTokens
        uint fee = settleFee(sellToken, msg.sender, amount, amountOfWIZToBurn);
        // Fees are added not to next starting auction, but to the auction after that
        extraSellTokens[sellToken][buyToken][auctionIndex + 1] += fee;
        uint amountAfterFee = amount - fee;

        // Update variables
        balances[sellToken][msg.sender] -= amount;
        sellerBalances[sellToken][buyToken][auctionIndex][msg.sender] += amountAfterFee;
        sellVolumes[sellToken][buyToken][auctionIndex] += amountAfterFee;
        NewSellOrder(sellToken, buyToken, msg.sender, auctionIndex, amount);
    }

    function postBuyOrder(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint amount,
        uint amountOfWIZToBurn
    )
        public
    {
        // Must be a valid token pair
        address token1;
        address token2;
        bool validTokenPair;
        (validTokenPair, token1, token2) = checkTokenPairAndOrder(sellToken, buyToken);
        require(validTokenPair);

        // Requirements
        require(auctionStarts[token1][token2] >= now);
        require(auctionIndex == latestAuctionIndices[token1][token2]);

        amount = Math.min(amount, balances[buyToken][msg.sender]);

        // Fee mechanism
        uint fee = settleFee(buyToken, msg.sender, amount, amountOfWIZToBurn);
        // Fees are always added to next auction
        extraBuyTokens[sellToken][buyToken][auctionIndex + 1] += fee;
        uint amountAfterFee = amount - fee;

        // Overbuy is when a part of a buy order clears an auction
        // In that case we only process the part before the overbuy
        // To calculate overbuy, we first get current price
        uint num;
        uint den;
        (num, den) = getPrice(sellToken, buyToken, auctionIndex);

        uint sellVolume = sellVolumes[sellToken][buyToken][auctionIndex];
        uint buyVolume = buyVolumes[sellToken][buyToken][auctionIndex];
        int overbuy = int(buyVolume + amountAfterFee - sellVolume * num / den);

        if (int(amountAfterFee) > overbuy) {
            // We must process the buy order
            if (overbuy > 0) {
                // We have to adjust the amountAfterFee
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
            clearAuction(sellToken, buyToken, auctionIndex, buyVolumes[sellToken][buyToken][auctionIndex], sellVolume);
        } else if (now >= auctionStarts[token1][token2] + 6 hours) {
            // Prices have crossed
            // We need to clear current or opposite auction
            closeCurrentOrOppositeAuction(
                token1,
                token2,
                sellToken,
                buyToken,
                auctionIndex,
                buyVolumes[sellToken][buyToken][auctionIndex],
                -1 * overbuy,
                sellVolume,
                num,
                den
            );
        }
    }

    function closeCurrentOrOppositeAuction(
        address token1,
        address token2,
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint finalBuyVolume,
        int outstandingVolume,
        uint sellVolume,
        uint currentAuctionNum,
        uint currentAuctionDen
    )
        internal
    {
        // Get variables
        uint sellVolumeOpp = sellVolumes[buyToken][sellToken][auctionIndex];
        uint buyVolumeOpp = buyVolumes[buyToken][sellToken][auctionIndex];
        uint outstandingVolumeOpp = sellVolumeOpp - buyVolumeOpp * currentAuctionNum / currentAuctionDen;

        if (outstandingVolume <= outstandingVolumeOpp) {
            uint outstandingVolumeInSellTokens = outstandingVolume * currentAuctionDen / currentAuctionNum;
            
            // Increment buy volume of current & opposite auctions
            buyVolumes[sellToken][buyToken]auctionIndex] += outstandingVolume;
            buyVolumes[buyToken][sellToken][auctionIndex] += outstandingVolumeInSellTokens;

            // Record number of tokens added
            arbTokensAdded[token1][token2] = outstandingVolumeInSellTokens;

            // Close current auction
            clearAuction(sellToken, buyToken, auctionIndex, buyVolumes[sellToken][buyToken][auctionIndex], sellVolume);
        } else {
            uint outstandingVolumeOppInSellTokens = outstandingVolumeOpp * currentAuctionDen / currentAuctionNum

            // Increment buy volume of current & opposite auctions 
            buyVolumes[sellToken][buyToken][auctionIndex] += outstandingVolumeOpp;
            buyVolumes[buyToken][sellToken][auctionIndex] += outstandingVolumeOppInSellTokens;

            // Record number of tokens added
            arbTokensAdded[token1][token2] = outstandingVolumeOpp;

            // Close opposite auction
            clearAuction(buyToken, sellToken, auctionIndex, buyVolumes[buyToken][sellToken][auctionIndex], sellVolumeOpp);
        }
    }

    function buy(
        address buyToken,
        address sellToken,
        uint amount,
        address from,
        address to,
        uint value,
        bytes data
    )
        public
    {
        Token(buyToken).transfer(msg.sender, amount);
        require(to.call.value(value)(data));
        uint maxAmount = Token(sellToken).allowance(msg.sender, this);
        require(Token(sellToken).transferFrom(msg.sender, this, maxAmount));
    }

    function claimSellerFunds(
        address sellToken,
        address buyToken,
        address user,
        uint auctionIndex
    )
        public
        returns (uint returned, uint tulipsIssued)
    {
        // Requirements
        uint sellerBalance = sellerBalances[sellToken][buyToken][auctionIndex][user];
        require(sellerBalance > 0);

        // Get closing price for said auction
        fraction memory closingPrice = closingPrices[sellToken][buyToken][auctionIndex];
        uint num = closingPrice.num;
        uint den = closingPrice.den;

        // Require auction to have cleared
        require(den > 0);

        // Calculate return
        returned = sellerBalance * num / den;

        // Get tulips issued based on ETH price of returned tokens
        if (sellToken == ETH) {
            tulipsIssued = sellerBalance;
        } else if (buyToken == ETH) {
            tulipsIssued = returned
        } else {
            // Neither token is ETH, so we use priceOracle()
            // priceOracle() depends on latestAuctionIndex
            // i.e. if a user claims tokens later in the future,
            // he/she is likely to get slightly different number
            tulipsIssued = returned * priceOracle(buyToken);
        }

        // Issue TUL
        TokenTUL(TUL).mintTokens(tulipsIssued);
        lockedTULBalances += tulipsIssued;

        // Add extra buy tokens
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
        // Must be a valid token pair
        address token1;
        address token2;
        bool validTokenPair;
        (validTokenPair, token1, token2) = checkTokenPairAndOrder(sellToken, buyToken);
        require(validTokenPair);

        returned = getUnclaimedBuyerFunds(sellToken, buyToken, user, auctionIndex);
        require(returned > 0);

        uint latestAuctionIndex = latestAuctionIndices[token1][token2];
        if (auctionIndex == latestAuctionIndex) {
            // Auction is running
            claimedAmounts[sellToken][buyToken][auctionIndex][user] += returned;
        } else {
            // Auction has closed
            // Reset buyerBalances and claimedAmounts
            buyerBalances[sellToken][buyToken][auctionIndex][user] = 0;
            claimedAmounts[sellToken][buyToken][auctionIndex][user] = 0;

            // Assign extra sell tokens (this is possible only after auction has cleared,
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
        // Must be a valid token pair
        address token1;
        address token2;
        bool validTokenPair;
        (validTokenPair, token1, token2) = checkTokenPairAndOrder(sellToken, buyToken);
        require(validTokenPair);

        // Checks if particular auction has ever run
        require(auctionIndex <= latestAuctionIndices[token1][token2]);

        uint buyerBalance = buyerBalances[sellToken][buyToken][auctionIndex][user];

        uint num;
        uint den;
        (num, den) = getPrice(sellToken, buyToken, auctionIndex);

        if (num == 0) {
            // This should rarely happen - as long as there is >= 1 buy order,
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
         // Must be a valid token pair
        address token1;
        address token2;
        bool validTokenPair;
        (validTokenPair, token1, token2) = checkTokenPairAndOrder(sellToken, buyToken);
        require(validTokenPair);

        // Check if auction has been initialised
        uint latestAuctionIndex = latestAuctionIndices[token1][token2];

        if (auctionIndex < latestAuctionIndex) {
            // Auction has closed
            fraction memory closingPrice = closingPrices[sellToken][buyToken][auctionIndex];
            (num, den) = (closingPrice.num, closingPrice.den);
        } else if (auctionIndex > latestAuctionIndex) {
            (num, den) = (0, 0);
        } else {
            // Auction is running
            uint sellTokenNum;
            uint sellTokenDen;
            (sellTokenNum, sellTokenDen) = priceOracle(sellToken);

            uint buyTokenNum;
            uint buyTokenDen;
            (buyTokenNum, buyTokenDen) = priceOracle(buyToken);

            // If we're calling the function into an unstarted auction,
            // it will return the starting price of that auction
            uint timeElapsed = now - auctionStarts[token1][token2];

            // The numbers below are chosen such that
            // P(0 hrs) = 2 * lastClosingPrice, P(6 hrs) = lastClosingPrice, P(>=24 hrs) = 0
            num = Math.max((0, (86400 - timeElapsed) * sellTokenNum * buyTokenDen);
            den = (timeElapsed + 43200) * sellTokenDen * buyTokenNum;
        }
    }

    /// @dev clears an Auction
    /// @param sellToken sellToken of the auction
    /// @param buyToken  buyToken of the auction
    /// @param auctionIndex of the auction to be cleared.
    function clearAuction(
        address sellToken,
        address buyToken,
        uint auctionIndex,
        uint clearingPriceNum,
        uint clearingPriceDen,
    )
        internal
    {
         // Get correct token order
        address token1;
        address token2;
        (, token1, token2) = checkTokenPairAndOrder(sellToken, buyToken);

        // Update closing prices
        closingPrices[sellToken][buyToken][auctionIndex] = fraction(clearingPriceNum, clearingPriceDen);

        uint oppositeClosingPriceDen = closingPrices[buyToken][sellToken].den;

        // Closing price denominator is initialised as 0
        if (oppositeClosingPriceDen > 0) {
            // Denominator cannot be 0 once auction has cleared, so this means opposite auction has cleared

            // Get amount of tokens that were added through arbitration
            uint arbitrationTokensAdded = arbTokensAdded[token1][token2];

            if (arbitrationTokensAdded > 0) {
                // Add extra tokens from arbitration to extra tokens
                fraction memory closingPriceOpp = closingPrices[buyToken][sellToken];
                uint extraFromArb1 = sellVolumes[sellToken][buyToken] + buyVolumes[buyToken][sellToken];
                uint extraFromArb2 = sellVolumes[buyToken][sellToken] * closingPriceOpp.num / closingPriceOpp.den;

                // Since this is the larger auction
                // It contains at least one buy order
                // Hence clearing price != 0
                // So dividing by clearingPriceNum doesn't break
                uint extraFromArb3 = (buyVolumes[sellToken][buyToken] - arbitrationTokensAdded) * clearingPriceDen / clearingPriceNum;
                extraSellTokens[sellToken][buyToken] += extraFromArb1 - extraFromArb2 - extraFromArb3;
            }

            // Check if either auction received sell orders
            uint sellVolumeNext = sellVolumes[sellToken][buyToken][auctionIndex + 1];
            uint sellVolumeNextOpposite = sellVolumes[buyToken][sellToken][auctionIndex + 1];
            if (sellVolumeNext > 0 && sellVolumeNextOpposite > 0) {
                // Schedule next auction
                auctionStarts[token1][token2] = now + 10 minutes;
            }

            latestAuctionIndices[token1][token2]++;
        }

        AuctionCleared(sellToken, buyToken, auctionIndex);
    }

    function settleFee(
        address token
        address user,
        uint amount,
        uint amountOfWIZBurnedSubmitted
    )
        internal
        returns (uint fee)
    {
        // Calculate fee based on proportion of all TUL tokens owned
        uint balanceOfTUL = TULBalances[user];

        // The fee function is chosen such that
        // F(0) = 0.5%, F(1%) = 0.25%, F(>=10%) = 0
        // (Takes in a amount of user's TUL tokens as ration of all TUL tokens, outputs fee ratio)
        // We premultiply by amount to get fee:
        fee = Math.max(0, amount * (totalSupplyOfTUL - 10 * balanceOfTUL) / (16000 * balanceOfTUL + 200 * totalSupplyOfTUL));

        if (fee > 0) {
            // Allow user to reduce up to half of the fee with WIZ

            uint tokenPriceNum;
            uint tokenPriceDen;
            (tokenPriceNum, tokenPriceDen) = priceOracle(token);

            // Convert fee to ETH, then USD
            uint feeInETH = fee * tokenPriceNum / tokenPriceDen;
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

        // We will compute weighted average by considering ETH amount in both auctions
        uint sellVolumeETH = sellVolumes[ETH][token][latestAuctionIndex - 1];
        uint buyVolumeToken = buyVolumes[token][ETH][latestAuctionIndex - 1];

        // Compute weighted average
        uint numFirstPart = sellVolumeETH * closingPriceETH.den * closingPriceToken.den;
        uint numSecondPart = buyVolumeToken * closingPriceToken.num * closingPriceETH.num;
        num = numFirstPart + numSecondPart;
        den = closingPriceETH.num * closingPriceToken.den * (sellVolumeETH + buyVolumeToken);
    }

    function checkTokenPairAndOrder(
        address token1,
        address token2
    )
        public
        constant
        returns (bool validPair, address _token1, address _token2)
    {
        if (latestAuctionIndices[token1][token2] > 0) {
            return (true, token1, token2);
        } else if (latestAuctionIndices[token2][token1] > 0 {
            return (true, token2, token1);
        } else {
            return (false, 0x0, 0x0);
        }
    }
}
