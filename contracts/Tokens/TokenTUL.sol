pragma solidity 0.4.18;
import "../Tokens/StandardToken.sol";
import "../Utils/Math.sol";


/// @title Standard token contract with overflow protection
contract TokenTUL is StandardToken {
    using Math for *;

    /*
     *  Storage
     */


    struct unlockedTUL {
        uint amout;
        uint withdrawalTime;
    }
    address owner;

    // user => unlockedTUL
    mapping (address => unlockedTUL) public unlockedTULs;
    // user => amount
    mapping (address => uint) public lockedTULBalances;
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

 	function updateOwner(
 		address _owner
	)
		public
		onlyOwner()
	{
		owner = _owner;
	}

    function mintTokens(
     	uint amount
 	)
    	public
    	onlyOwner()
    {
    	balances[owner] += amount;
    	totalTokens += amount;
    }

    /// @dev Lock TUL
    function lockTUL()
        public
    {
        //TObe goded
        // Transfer maximum number
        //allowances(msg.sender, this);
        //balances[msg.sender]-=;

        //lockedTULBalances[msg.sender] += allowance;
    }

    function unlockTUL(
        uint amount
    )
        public
    {
        //Tobecoded
        //amount = Math.min(amount, lockedTULBalances[msg.sender]);
        //lockedTULBalances[msg.sender] -= amount;
        //unlockedTULs[msg.sender].amount += amount;
        //unlockedTULs[msg.sender].withdrawalTime = now + 24 hours;
    }
    function getLockedAmount(address Owner
    ) 
        returns (uint){
            //Tobecoded
        return balances[Owner];
    }

}