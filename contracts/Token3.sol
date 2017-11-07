pragma solidity 0.4.15;

import "./Token.sol";

contract Token3 is Token {
    string public constant symbol = "Token3";
    string public constant name = "Token3";
    uint8 public constant decimals = 18;

    function Token3()
    	public
    	Token()
    {
    	
    }
}