pragma solidity 0.4.18;
import "../Tokens/StandardToken.sol";
import "../Utils/Math.sol";


/// @title Standard token contract with overflow protection
contract TokenTUL is StandardToken {
    using Math for *;

    /*
     *  Storage
     */
    address owner;

    /*
     * Modifiers
     */
     modifier onlyOwner() {
     	require(msg.sender == owner);
     	_;
     }

    /*
     *  Public functions
     */

    function TokenTUL(
     	address _owner
 	)
 		public
 	{
 		owner = _owner;
 	}

 	updateOwner(
 		address _owner
	)
		public
		onlyOwner()
	{
		owner = _owner;
	}

     mintTokens(
     	uint amount
 	)
    	public
    	onlyOwner()
    {
    	balances[owner] += amount;
    	totalTokens += amount;
    }


}
