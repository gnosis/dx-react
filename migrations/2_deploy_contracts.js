const DutchExchange = artifacts.require('./DutchExchange.sol')
const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')
const DutchExchangeGNOETH = artifacts.require('./DutchExchangeGNOETH.sol')
const DutchExchangeFactory = artifacts.require('./DutchExchangeFactory.sol')
const Token = artifacts.require('./Token.sol')
const TokenETH = artifacts.require('./TokenETH.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')
const Token3 = artifacts.require('./Token3.sol')

// ATTENTION!!!
// deployer.deploy() isn't a real Promise
// it only schedules contract deployment
// Promise.all, async...await won't work

module.exports = (deployer) => {
  // deploying 3 token contract to the network
  // for ETH, GNO and TUL (utility) tokens
  // all contracts are initialized with transactions {from: accounts[0]}
  // making accounts[0] the intial sender and for Tokens the owner
  deployer.deploy(TokenETH)
  deployer.deploy(TokenGNO)
  deployer.deploy(Token)
  deployer.then(() => {
    // deploying 2 DutchExhcange contracts that will run ETH -> GNO and GNO -> ETH auctions
    /**
     * initialClosingPriceNum = 2
     * initialClosingPriceDen = 1
     * _sellToken = ETH | GNO
     * _buyToken = GNO | ETH
     * _TUL = Token
     */
    deployer.deploy(DutchExchangeETHGNO, 2, 1, TokenETH.address, TokenGNO.address, Token.address)
    deployer.deploy(DutchExchangeGNOETH, 2, 1, TokenGNO.address, TokenETH.address, Token.address)

    deployer.deploy(Token3)
    deployer.deploy(DutchExchange)
    // it is necessary to return here
    // otherwise deployement will be scheduled after Saving successful migration to network
    // and any contract inside .then(() => {}) will reject Contract.deployed() promise
    return deployer.deploy(DutchExchangeFactory)
  })
}
