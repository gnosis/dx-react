const Math = artifacts.require('Math')
const DutchExchange = artifacts.require('DutchExchange')
const EtherToken = artifacts.require('EtherToken')
const PriceOracle = artifacts.require('PriceOracle')
const StandardToken = artifacts.require('StandardToken')
const TokenGNO = artifacts.require('TokenGNO')
const OWL = artifacts.require('OWL')

module.exports = function deploy(deployer, networks, accounts) {
  let TokenGNOInstance, PriceOracleInstance

  deployer.deploy(Math)
  deployer.link(Math, [OWL, PriceOracle, DutchExchange, StandardToken, EtherToken, TokenGNO])

  deployer.deploy(EtherToken).then(() => deployer.deploy(TokenGNO))
    .then(() => deployer.deploy(StandardToken))
    .then(() => deployer.deploy(PriceOracle, accounts[0], EtherToken.address))
    .then(() => PriceOracle.deployed())
    .then((p) => {
      PriceOracleInstance = p
      return PriceOracleInstance.owner.call()
    })
    .then((oI) => {
      console.log(oI)
      console.log(accounts[0])
      return deployer.deploy(OWL, TokenGNO.address /* ,PriceOracle.adress */)
    })
    .then(() => deployer.deploy(
      DutchExchange,
      accounts[0],
      EtherToken.address,
      PriceOracle.address,
      StandardToken.address,
      TokenGNO.address,
    ))
    .then(() => {
      console.log(DutchExchange.address)
      console.log(PriceOracleInstance.address)
      return PriceOracleInstance.updateDutchExchange(DutchExchange.address, { from: accounts[0] })
    })
    .then(() => PriceOracleInstance.getCurrentDutchExchange.call())
    .then((DutchExchangeAddress) => {
      console.log(DutchExchangeAddress)
    })
}
