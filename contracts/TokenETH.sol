pragma solidity ^0.4.18;

import "./Token.sol";

contract TokenETH is Token {
    string public constant symbol = "ETH";
    string public constant name = "Ether";
    uint8 public constant decimals = 18;

    function TokenETH()
    	public
    	Token()
    {
    	
    }
}