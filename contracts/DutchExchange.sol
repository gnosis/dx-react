pragma solidity 0.4.15;

import "./Token.sol";

/// @title Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - <dominik.teiml@gnosis.pm>

contract DutchExchange {
    // This contract represents an exchange between two ERC20 tokens

    // The price is a rational number, so we need a concept of a fraction:
    struct fraction {
        // Numerator
        uint256 num;

        // Denominator
        uint256 den;
    }

    // If DX is running, this is the start time of that auction
    // If DX is cleared, this is the scheduled time of the next auction
    uint256 public auctionStart;

    // Tokens that are being traded
    Token public sellToken;
    // Usually ETH
    Token public buyToken;
    // TUL tokens provide benefit to regular users
    Token public TUL;

    // Index of the current auction. This is necessary to store closing prices (see next variable)
    uint256 public auctionIndex = 1;

    // The prices at which all auctions cleared, will influence the price scale of the next auction
    mapping (uint256 => fraction) public closingPrices;

    // Sell volume for current auction. Needed to determine when auction clears
    uint256 public sellVolumeCurrent;
    // Cumulative sell volume for next auction
    uint256 public sellVolumeNext;
    // Buy volumes for all auctions. Needed to display most busy auctions
    mapping (uint256 => uint256) public buyVolumes;

    // Seller balances for all auctions. The first uint256 is auction index
    // (needed because closing price could be different for each auction)
    mapping (uint256 => mapping (address => uint256)) public sellerBalances;
    // Buyer balances for all auctions
    mapping (uint256 => mapping (address => uint256)) public buyerBalances;
    // Buyers can claim tokens while auction is running, so we need to store that
    mapping (uint256 => mapping (address => uint256)) public claimedAmounts;

    // Events
    event NewSellOrder(uint256 indexed _auctionIndex, address indexed _from, uint256 amount);
    event NewBuyOrder(uint256 indexed _auctionIndex, address indexed _from, uint256 amount);
    event NewSellerFundsClaim(uint256 indexed _auctionIndex, address indexed _from, uint256 _returned);
    event NewBuyerFundsClaim(uint256 indexed _auctionIndex, address indexed _from, uint256 _returned);
    event AuctionCleared(uint256 _auctionIndex);

    // Constructor
    function DutchExchange(
        uint256 initialClosingPriceNum,
        uint256 initialClosingPriceDen,
        address _sellToken,
        address _buyToken,
        address _TUL
    ) public {
        // Calculate initial price
        fraction memory initialClosingPrice;
        initialClosingPrice.num = initialClosingPriceNum;
        initialClosingPrice.den = initialClosingPriceDen;
        closingPrices[0] = initialClosingPrice;

        // Set variables
        sellToken = Token(_sellToken);
        buyToken = Token(_buyToken);
        TUL = Token(_TUL);
        scheduleNextAuction();
    }

    function postSellOrder(uint256 amount) public returns (bool success) {
        require(sellToken.transferFrom(msg.sender, this, amount));

        if (auctionStart <= now) {
            // There is an active auction, we add sell order to next auction
            sellerBalances[auctionIndex + 1][msg.sender] += amount;
            sellVolumeNext += amount;
        } else {
            // No active auction, we add it to the scheduled auction
            sellerBalances[auctionIndex][msg.sender] += amount;
            sellVolumeCurrent += amount;
        }

        NewSellOrder(auctionIndex, msg.sender, amount);
        success = true;
    }

    function postBuyOrder(uint256 amount, uint256 _auctionIndex) 
        public
    {
        // User inputs the current auction index, this is a fail-safe in case
        // his/her transaction is mined after the auction clears
        require(auctionIndex == _auctionIndex);
        require(auctionStart <= now);

        // Get current price to calculate overflow
        uint256 num;
        uint256 den;
        (num, den) = getPrice(_auctionIndex);

        // Calculate if buy order overflows
        int256 overflow = int256(buyVolumes[_auctionIndex] + amount - sellVolumeCurrent * num / den);

        if (int256(amount) > overflow) {
            // We must process the buy order
            if (overflow > 0) {
                // We have to adjust the amount
                amount -= uint256(overflow);
            }

            // Perform transfer
            require(buyToken.transferFrom(msg.sender, this, amount));
            buyVolumes[auctionIndex] += amount;
            buyerBalances[auctionIndex][msg.sender] += amount;

            NewBuyOrder(auctionIndex, msg.sender, amount);
        }

        // Clear auction
        if (overflow >= 0) {
            clearAuction(num, den);
            scheduleNextAuction();
        }
    }

    function postBuyOrderAndClaim(uint256 amount, uint256 _auctionIndex)
        public 
    {
        postBuyOrder(amount, _auctionIndex);
        claimBuyerFunds(msg.sender, _auctionIndex);
    }

    function claimSellerFunds(address user, uint256 _auctionIndex) 
        public 
        returns (uint256 returned) 
    {
        uint256 sellerBalance = sellerBalances[_auctionIndex][user];

        // Checks if particular auction has cleared
        require(auctionIndex > _auctionIndex);
        
        // Get closing price for said auction
        fraction memory closingPrice = closingPrices[_auctionIndex];
        uint256 num = closingPrice.num;
        uint256 den = closingPrice.den;

        // Calculate return amount
        returned = sellerBalance * num / den;
        require(returned > 0);

        // Perform transfer
        sellerBalances[_auctionIndex][user] = 0;
        require(buyToken.transfer(user, returned));
        NewSellerFundsClaim(_auctionIndex, user, returned);
    }

    function claimSellerFundsOfAuctions(address user, uint256[] auctionIndices)
        public
        returns (uint256 returned)
    {
        for (uint i; i < auctionIndices.length; i++) {
            returned += claimSellerFunds(user, i);
        }
    }

    function claimAllSellerFunds(address user, uint256 _auctionIndex)
        public
        returns (uint256 returned)
    {
        uint256[] memory auctionIndices = getIndicesOfAuctionsContainingUnclaimedSellerFunds(user, _auctionIndex);
        returned = claimSellerFundsOfAuctions(user, auctionIndices);
    }

    function claimBuyerFunds(address user, uint256 _auctionIndex) 
        public 
        returns (uint256 returned) 
    {
        returned = getUnclaimedBuyerFunds(user, _auctionIndex);
        require(returned > 0);

        if (_auctionIndex == auctionIndex) {
            claimedAmounts[_auctionIndex][user] += returned;
        } else {
            // If auction has closed, we can reset buyerBalances and claimedAmounts
            buyerBalances[_auctionIndex][user] = 0;
            claimedAmounts[_auctionIndex][user] = 0;
        }

        // Perform transfer
        require(sellToken.transfer(user, returned));
        NewBuyerFundsClaim(_auctionIndex, user, returned);
    }

    function claimBuyerFundsOfAuctions(address user, uint256[] auctionIndices)
        public
        returns (uint256 returned)
    {
        for (uint i; i < auctionIndices.length; i++) {
            returned += claimBuyerFunds(user, i);
        }
    }

    function claimAllBuyerFunds(address user, uint256 _auctionIndex)
        public
        returns (uint256 returned)
    {
        uint256[] memory auctionIndices = getIndicesOfAuctionsContainingUnclaimedBuyerFunds(user, _auctionIndex);
        returned = claimBuyerFundsOfAuctions(user, auctionIndices);
    }

    function claimAllFunds(address user, uint256 _auctionIndex)
        public
        returns (uint256 returnedSellerFunds, uint256 returnedBuyerFunds)
    {
        returnedSellerFunds = claimAllSellerFunds(user, _auctionIndex);
        returnedBuyerFunds = claimAllBuyerFunds(user, _auctionIndex);
    }

    // for one auction 
    function getUnclaimedBuyerFunds(address user, uint256 _auctionIndex)
        public
        constant
        returns (uint256 unclaimedFunds)
    {
        // Checks if particular auction has ever run
        require(auctionIndex >= _auctionIndex);

        uint256 buyerBalance = buyerBalances[_auctionIndex][user];

        uint256 num;
        uint256 den;
        (num, den) = getPrice(_auctionIndex);

        unclaimedFunds = buyerBalance * den / num - claimedAmounts[_auctionIndex][user];
    }

    function getIndicesOfAuctionsContainingUnclaimedSellerFunds(address user, uint256 _auctionIndex)
        public
        constant
        returns (uint256[] arrayOfAuctionIndices)
    {
        for (uint i = _auctionIndex; i > _auctionIndex - 120; i--) {
            if (sellerBalances[i][user] > 0) {
                // e.g. if _auctionIndex is 100 and there are funds in auctions 100 and 96,
                // this will output A[0] = 100, A[4] = 96.
                // (it's done this way because memory array cannot have dynamic length)
                arrayOfAuctionIndices[_auctionIndex - i] = i;
            }
        }
    }


    function getIndicesOfAuctionsContainingUnclaimedBuyerFunds(address user, uint256 _auctionIndex)
        public
        constant
        returns (uint256[] arrayOfAuctionIndices)
    {
        for (uint i = _auctionIndex; i > _auctionIndex - 120; i--) {
            // since we reset buyerBalances when a user claims from a closed auction,
            // this also takes care of the case when a user has partially claimed
            // from current auction
            if (buyerBalances[i][user] > 0) {
                arrayOfAuctionIndices[_auctionIndex - i] = i;
            }
        }
    }

    function getAllUnclaimedSellerFunds(address user, uint256 _auctionIndex)
        public
        constant
        returns (uint256 unclaimedSellerFunds)
    {
        for (uint i = _auctionIndex; i > _auctionIndex - 120; i--) {
            uint256 balance = sellerBalances[i][user];
            if (balance > 0) {
                // Fetch price
                uint256 num;
                uint256 den;
                (num, den) = getPrice(i);

                // Add converted amount
                unclaimedSellerFunds += balance * num / den;
            }
        }
    }

    function getAllUnclaimedBuyerFunds(address user, uint256 _auctionIndex)
        public
        constant
        returns (uint256 unclaimedBuyerFunds)
    {
        for (uint i = _auctionIndex; i > _auctionIndex - 120; i--) {
            uint256 balance = buyerBalances[i][user];

            if (balance > 0) {
                // if we're talking about the current auction, we have to subtract claimedAmount
                if (i == auctionIndex) {
                    unclaimedBuyerFunds -= claimedAmounts[i][user];
                }

                // Fetch price
                uint256 num;
                uint256 den;
                (num, den) = getPrice(i);

                // Add converted amount
                unclaimedBuyerFunds += balance * den / num;
            }
        }
    }

    function getAllUnclaimedFunds(address user, uint256 _auctionIndex)
        public
        constant
        returns (uint256 unclaimedSellerFunds, uint256 unclaimedBuyerFunds)
    {
        unclaimedSellerFunds = getAllUnclaimedSellerFunds(user, _auctionIndex);
        unclaimedBuyerFunds = getAllUnclaimedBuyerFunds(user, _auctionIndex);
    }

    function getPrice(uint256 _auctionIndex)
        public
        constant
        returns (uint256 num, uint256 den) 
    {
        // Checks if particular auction has been initialised
        require(auctionIndex >= _auctionIndex);

        if (auctionIndex > _auctionIndex) {
            // Auction has closed
            fraction memory closingPrice = closingPrices[_auctionIndex];
            num = closingPrice.num;
            den = closingPrice.den;
        } else {
            // We need to check whether auction has begun:
            require(auctionStart <= now);

            // Next we calculate current price by first getting the last closing price
            fraction memory lastClosingPrice = closingPrices[_auctionIndex - 1];
            uint256 numOfLastClosingPrice = lastClosingPrice.num;
            uint256 denOfLastClosingPrice = lastClosingPrice.den;

            // The numbers 36k and 18k are chosen such that the initial price is double the last closing price,
            // And after 5 hours (18000 s), the price is the same as last closing price
            num = 36000 * numOfLastClosingPrice;
            den = (now - auctionStart + 18000) * denOfLastClosingPrice;
        }  
    }

    function clearAuction(uint256 currentPriceNum, uint256 currentPriceDen)
        internal
        returns (bool success) 
    {
        if (sellVolumeNext == 0) {
            // No sell orders were submitted
            closingPrices[auctionIndex].num = closingPrices[auctionIndex - 1].num;
            closingPrices[auctionIndex].den = closingPrices[auctionIndex - 1].den;
        } else {
            // We need to make the numbers smaller to prevent overflow
            if (currentPriceNum > 10**18 || currentPriceDen > 10**18) {
                currentPriceNum = currentPriceNum / 10**9;
                currentPriceDen = currentPriceDen / 10**9;
            }
            
            // Update state variables
            closingPrices[auctionIndex].num = currentPriceNum;
            closingPrices[auctionIndex].den = currentPriceDen;
            sellVolumeNext = 0;
        }

        sellVolumeCurrent = sellVolumeNext;
        auctionIndex++;

        AuctionCleared(auctionIndex - 1);
        success = true;
    }

    function scheduleNextAuction()
        internal
    {
        // Number of elapsed 6-hour periods since 1/1/1970
        uint256 elapsedPeriods = now / 1 hours / 6;
        // Set start period to following one
        auctionStart = (elapsedPeriods + 1) * 6 * 1 hours;
    }

    // --- For Testing only! ---

    // uint256 public now = 1508473469;
    // function increaseTimeBy(uint256 byHours, uint256 bySeconds) public {
    //     now += byHours * 1 hours;
    //     now += bySeconds;
    // }

    // function setTime(uint256 newTime) public {
    //     now = newTime;
    // }
}