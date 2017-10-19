var DutchExchange = artifacts.require("./DutchExchange.sol");
var DutchExchangeFactory = artifacts.require("./DutchExchangeFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(DutchExchange);
  deployer.deploy(DutchExchangeFactory);
};