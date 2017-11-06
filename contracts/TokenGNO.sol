pragma solidity 0.4.15;

import "./Token.sol";

contract TokenGNO is Token {
    string public constant symbol = "GNO";
    string public constant name = "Gnosis";
    uint8 public constant decimals = 18;

    function TokenGNO()
   		public
   		Token()
    {

    }
}