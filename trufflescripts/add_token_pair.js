/* eslint no-console:0 */

const TokenETH = artifacts.require('./EtherToken.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')
const PriceOracle = artifacts.require('./PriceFeed.sol')
const Medianizer = artifacts.require('./Medianizer.sol')
const DutchExchange = artifacts.require('./DutchExchange.sol')
const Proxy = artifacts.require('Proxy')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec trufflescripts/deposit.js
 * to deposit funds to DutchExchange contracts
 * @flags:
 * --seller                     as the seller
 * --buyer                      as the buyer
 * -a <address>                 as the given address
 * --eth <number>               ETH tokens
 * --gno <number>               GNO tokens
 */

module.exports = async () => {
  const accounts = web3.eth.accounts

  const dx = await DutchExchange.at(Proxy.address)
  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()
  const oracle = await PriceOracle.deployed()
  const medianizer = await Medianizer.deployed()

  const startingETH = 50
  const startingGNO = 50
  const ethUSDPrice = 10000

  await Promise.all(accounts.map((acct) => {
    /* eslint array-callback-return:0 */
    if (acct === accounts[0]) return
    eth.deposit({ from: acct, value: startingETH })
    eth.approve(dx.address, startingETH, { from: acct })
    gno.transfer(acct, startingGNO, { from: accounts[0] })
    gno.approve(dx.address, startingGNO, { from: acct })
  }))
  // Deposit depends on ABOVE finishing first... so run here
  await Promise.all(accounts.map((acct) => {
    if (acct === accounts[0]) return
    dx.deposit(eth.address, startingETH, { from: acct })
    dx.deposit(gno.address, startingGNO, { from: acct })
  }))

  console.log('Threshold new token pair == ', (await dx.thresholdNewTokenPair.call()).toNumber())
  console.log('ETHER = ', (await dx.balances.call(eth.address, accounts[1])).toNumber())
  console.log('GNO = ', (await dx.balances.call(gno.address, accounts[1])).toNumber())
  console.log((await dx.getAuctionIndex.call(eth.address, gno.address)).toNumber())

  await oracle.post(ethUSDPrice, 1516168838 * 2, medianizer.address, { from: accounts[0] })

  await dx.addTokenPair(
    TokenETH.address,     // -----> SellToken Address
    TokenGNO.address,     // -----> BuyToken Address
    10,                   // -----> token1Funding
    0,                    // -----> token2Funding
    2,                    // -----> closingPriceNum
    1,                    // -----> closingPriceDen
    { from: accounts[1] },
  )
}
