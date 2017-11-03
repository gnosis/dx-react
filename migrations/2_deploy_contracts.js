var DutchExchange = artifacts.require("./DutchExchange.sol");
var DutchExchangeFactory = artifacts.require("./DutchExchangeFactory.sol");
var Token1 = artifacts.require("./Token1.sol");
var Token2 = artifacts.require("./Token2.sol");
var Token3 = artifacts.require("./Token3.sol");

module.exports = function(deployer) {
  deployer.deploy(DutchExchange);
  deployer.deploy(DutchExchangeFactory);
  deployer.deploy(Token1);
  deployer.deploy(Token2);
  deployer.deploy(Token3);
};
