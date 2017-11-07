const DutchExchange = artifacts.require('./DutchExchange.sol')
const DutchExchangeFactory = artifacts.require('./DutchExchangeFactory.sol')
// var Token = artifacts.require("./Token.sol");
const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')
// const Token3 = artifacts.require('./Token3.sol')

module.exports = function f(deployer) {
  deployer.deploy(DutchExchange)
  deployer.deploy(DutchExchangeFactory)
  // deployer.deploy(Token, {});
  deployer.deploy(TokenETH)
  deployer.deploy(TokenGNO)
  // deployer.deploy(Token3)
}
