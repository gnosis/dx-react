pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import  "../contracts/Balance.sol";

contract TestBalance {

    function testUserCanGetBalance() {
        Balance balance = Balance(DeployedAddresses.Balance());

        uint expectedBal = 10000;     

        Assert.equal(balance.getBalance(tx.origin), expectedBal, "returnedAddress should be 0x0e11f18edf4ff2b7bb587c9767eccbabd6b1e03f");
    }
}
