pragma solidity ^0.4.24;

import "@gnosis.pm/util-contracts/contracts/GnosisStandardToken.sol";

contract TokenRDN is GnosisStandardToken {
    string public constant symbol = "RDN";
    string public constant name = "Raiden Token";
    uint8 public constant decimals = 18;

    function TokenRDN(
    	uint amount
    )
    	public 
    {
    	balances[msg.sender] = amount;
    }
}
