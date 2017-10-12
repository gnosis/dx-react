pragma solidity ^0.4.11;

contract Balance {
    
    address public owner;
    mapping (address => uint) public balances;

    event Sent(address from, address to, uint amount);
    
    function Balance() {
        owner = msg.sender;
        balances[tx.origin] = 10000;
    }

    function sendMoneyz(address to, uint amount) {
        if (balances[owner] < amount) return;
        balances[msg.sender] -= amount;
        balances[to] += amount;
        Sent(msg.sender, to, amount);
    }

    function getBalance(address personAddress) returns (uint) {
        if (personAddress != owner) return;
        return balances[personAddress];
    }
}