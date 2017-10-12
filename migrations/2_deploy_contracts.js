var Balance = artifacts.require("./Balance.sol");

module.exports = function(deployer) {
    deployer.deploy(Balance);
};
