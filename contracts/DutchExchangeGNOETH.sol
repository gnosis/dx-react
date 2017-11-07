pragma solidity 0.4.15;

import "./DutchExchange.sol";
import "./Token.sol";

/// @title GNO - ETH Dutch Exchange - exchange token pairs with the clever mechanism of the dutch auction
/// @author Dominik Teiml - <dominik.teiml@gnosis.pm>

contract DutchExchangeGNOETH is DutchExchange {
    function DutchExchangeGNOETH(
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