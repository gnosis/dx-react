pragma solidity ^0.4.17;
import "@gnosis/gnosis-contracts/contracts/Tokens/Token.sol";

/// @title Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - dominik.teiml@gnosis.pm
contract DutchExchange {
    // This contract represents an exchange between two ERC20 tokens

    // Types
    enum DutchExchangeState {
        // The only time buy orders are accepted. Also, sell orders are accepted for next auction
        AUCTION_STATE_RUNNING,
        // Auction has cleared, all parties can claim their tokens. A new auction is scheduled
        // for the next starting time (every 6 hrs)
        AUCTION_STATE_CLEARED
    }

    // The price is a rational number, so we need a concept of a fraction:
    struct fraction {
        uint256 numerator;
        uint256 denominator;
    }

    // If DX is running, this is the start time of that auction
    // If DX is cleared, this is the scheduled time of the next auction
    uint256 auctionStart;

    // Tokens that are being traded
    Token public sellToken;
    // Usually ETH
    Token public buyToken;
    // DUTCHX tokens, used to vote on new token proposals
    Token public DUTCHX;

    // State of the auction
    DutchExchangeState public exchangeState;

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
    // Buyer balances for current auction (usually in ETH)
    mapping (uint256 => mapping (address => uint256)) public buyerBalances;
    // Buyers can claim tokens while auction is running, so we need to store that
    mapping (uint256 => mapping (address => uint256)) public claimedAmounts;

    // By the way, sum of buyer/seller balances need not equal buy/sell volumes for 
    // a specific auction, because the former is reset when a user claims their funds

    // Events
    event newSellOrder(uint256 indexed _auctionIndex, address indexed _from, uint256 amount);
    event newBuyOrder(uint256 indexed _auctionIndex, address indexed _from, uint256 amount);
    event newSellerFundsClaim(uint256 indexed _auctionIndex, address indexed _from, uint256 _returned);
    event newBuyerFundsClaim(uint256 indexed _auctionIndex, address indexed _from, uint256 _returned);
    event auctionCleared(uint256 _auctionIndex);

    // Modifiers
    modifier auctionIsRunning() {
        require(exchangeState == DutchExchangeState.AUCTION_STATE_RUNNING);
        _;
    }

    // Constructor
    function DutchExchange(
        fraction initialClosingPrice,
        Token _sellToken,
        Token _buyToken,
        Token _DUTCHX
    ) public {
        closingPrices[0] = initialClosingPrice;
        sellToken = _sellToken;
        buyToken = _buyToken;
        DUTCHX = _DUTCHX;
    }

    function clearAuction(fraction currentPrice) public returns (bool success) {
        // Update state variables
        closingPrices[auctionIndex] = currentPrice;
        sellVolumeCurrent = sellVolumeNext;
        sellVolumeNext = 0;
        auctionIndex++;

        // Change auction state
        exchangeState = DutchExchangeState.AUCTION_STATE_CLEARED;

        // Schedule next auction

        // Number of elapsed 6-hour periods since 1/1/1970
        uint256 elapsedPeriods = now / 1 hours / 6;
        // Set start period to following one;
        auctionStart = (elapsedPeriods + 1) * 6 * 1 hours;

        auctionCleared(auctionIndex - 1);
        success = true;
    }

    function postSellOrder(uint256 amount) public returns (bool success) {
        require(sellToken.transferFrom(msg.sender, this, amount));

        if (exchangeState == DutchExchangeState.AUCTION_STATE_RUNNING) {
            sellerBalances[auctionIndex + 1][msg.sender] += amount;
            sellVolumeNext += amount;
        } else if (exchangeState == DutchExchangeState.AUCTION_STATE_CLEARED) {
            sellerBalances[auctionIndex][msg.sender] += amount;
            sellVolumeCurrent += amount;
        }

        newSellOrder(auctionIndex, msg.sender, amount);
        success = true;
    }

    function postBuyOrder(uint256 amount, uint256 minBuyAmount) public auctionIsRunning returns (bool success) {
        // Get current price
        fraction memory currentPrice = getCurrentPrice();
        uint256 num = currentPrice.numerator;
        uint256 den = currentPrice.denominator;

        // The user should enter minimum amount he is expecting to get from his buy order
        // This verifies that he will get at least that much
        // It will fail when the buy order is processed after the auction ends
        require(amount * den / num >= minBuyAmount);

        // The last buy order will very likely overflow
        // If overflow is negative, auction isn't cleared yet
        uint256 overflow = buyVolumes[auctionIndex] + amount - sellVolumeCurrent * num / den;
        uint256 amountWithoutOverflow;

        // Calculate amount without overflow
        if (overflow > 0) {
            amountWithoutOverflow = amount - overflow;
        } else {
            amountWithoutOverflow = amount;
        }

        // Perform transfer
        require(buyToken.transferFrom(msg.sender, this, amountWithoutOverflow));
        buyVolumes[auctionIndex] += amountWithoutOverflow;
        buyerBalances[auctionIndex][msg.sender] += amountWithoutOverflow;

        newBuyOrder(auctionIndex, msg.sender, amountWithoutOverflow);

        // Clear auction
        if (overflow >= 0) {
            clearAuction(currentPrice);
        }

        success = true;
    }

    function postBuyOrderAndClaim(uint256 amount, uint256 minBuyAmount) public auctionIsRunning returns (bool success) {
        require(postBuyOrder(amount, minBuyAmount));

        claimBuyerFundsOfCurrentAuction(msg.sender);

        success = true;
    }

    function claimSellerFunds(uint256 _auctionIndex) public returns (uint256 returned) {
        uint256 sellerBalance = sellerBalances[_auctionIndex][msg.sender];

        // Checks if particular auction has cleared
        require(auctionIndex > _auctionIndex);
        require(sellerBalance > 0);
        
        // Get closing price for said auction
        fraction memory closingPrice = closingPrices[_auctionIndex];
        uint256 num = closingPrice.numerator;
        uint256 den = closingPrice.denominator;

        // Perform transfer
        returned = sellerBalance * num / den;
        sellerBalances[_auctionIndex][msg.sender] = 0;
        require(buyToken.transfer(msg.sender, returned));
        newSellerFundsClaim(_auctionIndex, msg.sender, returned);
    }

    // This allows a buyer to claim intermediate funds as many times as they like
    function claimBuyerFundsOfCurrentAuction(address claimer) public returns (uint256 returned) {
        // If an auction has already cleared, it is equivalent to calling claimBuyerFunds()
        if (exchangeState == DutchExchangeState.AUCTION_STATE_CLEARED) {
            returned = claimBuyerFunds(claimer, auctionIndex - 1);
        } else {
            uint256 buyerBalance = buyerBalances[auctionIndex][claimer];

            // Get current price
            fraction memory currentPrice = getCurrentPrice();
            uint256 num = currentPrice.numerator;
            uint256 den = currentPrice.denominator;

            // Get amount to return
            returned = buyerBalance * den / num - claimedAmounts[auctionIndex][claimer];
            require(returned > 0);

            // Perform transfer
            claimedAmounts[auctionIndex][claimer] += returned;
            require(sellToken.transfer(claimer, returned));

            newSellerFundsClaim(auctionIndex, claimer, returned);
        }
    }

    function claimBuyerFunds(address claimer, uint256 _auctionIndex) public returns (uint256 returned) {
        uint256 buyerBalance = buyerBalances[_auctionIndex][claimer];

        // Checks if particular auction has cleared
        require(auctionIndex > _auctionIndex);

        // Get closing price for said auction
        fraction memory closingPrice = closingPrices[_auctionIndex];
        uint256 num = closingPrice.numerator;
        uint256 den = closingPrice.denominator;

        // Get amount to return
        returned = buyerBalance * den / num - claimedAmounts[_auctionIndex][claimer];
        require(returned > 0);

        // Perform transfer
        buyerBalances[_auctionIndex][claimer] = 0;
        require(sellToken.transfer(claimer, returned));
        newBuyerFundsClaim(_auctionIndex, claimer, returned);
    }

    function getCurrentPrice() public constant auctionIsRunning returns (fraction currentPrice) {
        // Get last closing price
        fraction lastClosingPrice = closingPrices[auctionIndex - 1];
        uint256 num = lastClosingPrice.numerator;
        uint256 den = lastClosingPrice.denominator;

        // The numbers 36k and 18k are chosen, so the initial price is double the last closing price
        // And after 5 hours (18000 s), the price is the same as last closing price
        currentPrice.numerator = 36000 * num;
        currentPrice.denominator = (now - auctionStart + 18000) * den;
    }
}