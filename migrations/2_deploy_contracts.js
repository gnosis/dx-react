/* eslint no-multi-spaces: 0, no-console: 0 */

const Math = artifacts.require('Math')
const DutchExchange = artifacts.require('DutchExchange')
const EtherToken = artifacts.require('EtherToken')
const PriceOracle = artifacts.require('PriceOracle')
const StandardToken = artifacts.require('StandardToken')
const TokenGNO = artifacts.require('TokenGNO')
const OWL = artifacts.require('OWL')

module.exports = function deploy(deployer, networks, accounts) {
  let PriceOracleInstance

  deployer.deploy(Math)
  deployer.link(Math, [OWL, PriceOracle, DutchExchange, StandardToken, EtherToken, TokenGNO])

  deployer.deploy(EtherToken)
    .then(() => deployer.deploy(TokenGNO, 50000))
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

    // @dev DX Constructor creates exchange
    .then(() => deployer.deploy(
      DutchExchange,              // Contract Name
      accounts[0],                // @param _owner will be the admin of the contract
      EtherToken.address,         // @param _ETH                - address of ETH ERC-20 token
      PriceOracle.address,        // @param _priceOracleAddress - address of priceOracle
      StandardToken.address,      // @param _TUL                - address of TUL ERC-20 token
      TokenGNO.address,           // @param _OWL                - address of OWL ERC-20 token
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
