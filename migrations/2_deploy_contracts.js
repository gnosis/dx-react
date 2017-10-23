var DutchExchange = artifacts.require("./DutchExchange.sol");
var DutchExchangeFactory = artifacts.require("./DutchExchangeFactory.sol");
var Token = artifacts.require("./Token.sol");

module.exports = function(deployer) {
  deployer.deploy(DutchExchange);
  deployer.deploy(DutchExchangeFactory);
  deployer.deploy(Token);
};
