pragma solidity 0.4.18;

import "./DutchExchange.sol";
import "./Token.sol";

/// @title ETH - GNO Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - <dominik.teiml@gnosis.pm>

contract DutchExchangeETHGNO is DutchExchange {
    function DutchExchangeETHGNO(
        uint256 initialClosingPriceNum,
        uint256 initialClosingPriceDen,
        address _sellToken,
        address _buyToken,
        address _TUL
    )
        public
        DutchExchange(initialClosingPriceNum, initialClosingPriceDen, _sellToken, _buyToken, _TUL)
    {

    }
}