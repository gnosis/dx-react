/* eslint no-console:0 */

const TokenETH = artifacts.require('./EtherToken.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

const DutchExchange = artifacts.require('./DutchExchange.sol')
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

  const [acct] = web3.eth.accounts

  const dx = await DutchExchange.deployed()
  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()


  const startingETH = 50 ** 8
  const startingGNO = 50 ** 8
  const ethUSDPrice = 1100 ** 8

  await Promise.all([
    eth.deposit({ from: acct, value: startingETH }),
    eth.approve(dx.address, startingETH, { from: acct }),
    gno.transfer(acct, startingGNO, { from: acct }),
    gno.approve(dx.address, startingGNO, { from: acct }),
  ])
  // Deposit depends on ABOVE finishing first... so run here
  await Promise.all([
    dx.deposit(eth.address, startingETH, { from: acct }),
    dx.deposit(gno.address, startingGNO, { from: acct }),
  ])

  dx.addTokenPair(
    TokenETH.address,
    TokenGNO.address,
    10 ** 8,
    0,
    2,
    1,
    { from: acct },
  )
}
