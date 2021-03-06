/* eslint no-console:0, no-multi-spaces:0, prefer-destructuring:1 */

const TokenETH = artifacts.require('EtherToken')
const TokenGNO = artifacts.require('TokenGNO')
const TokenOMG = artifacts.require('TokenOMG')
const TokenRDN = artifacts.require('TokenRDN')
const PriceOracle = artifacts.require('PriceFeed')
const Medianizer = artifacts.require('Medianizer')
const DutchExchange = artifacts.require('DutchExchange')
const Proxy = artifacts.require('DutchExchangeProxy')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

const { mineCurrentBlock, mergeAPI } = require('./utils')(web3)

/**
 * truffle exec test/trufflescripts/add_token_pair.js
 * adds a new TokenPair as master account by default
 * @flags:
 * --seller                     as the seller
 * --buyer                      as the buyer
 * -a <address>                 as the given address
 * --t1 <number>                starting T1(ETH) tokens
 * --t2 <number>                starting T2(GNO) tokens
 * --pair <sellToken,buyToken>  token pair auction, eth,gno by default
 */

module.exports = async () => {
  const { account, accountName, accounts, master, toBN, toWei } = await mergeAPI(argv)

  try {
    const dx = await DutchExchange.at(Proxy.address)
    const eth = await TokenETH.deployed()
    const gno = await TokenGNO.deployed()
    const rdn = await TokenRDN.deployed() // TokenGNO.new(web3.toWei(10000, 'ether'), { from: master })
    const omg = await TokenOMG.deployed() // TokenGNO.new(web3.toWei(10000, 'ether'), { from: master })
    const oracle = await PriceOracle.deployed()
    const medianizer = await Medianizer.deployed()

    const availableTokens = {
      eth,
      gno,
      rdn,
      omg,
    }
    const [sell, buy] = argv.pair ? argv.pair.split(',') : ['eth', 'gno']

    const sellToken = availableTokens[sell.toLowerCase()]
    const buyToken = availableTokens[buy.toLowerCase()]

    const startingETH = argv.t1 || toWei(10, 'ether')
    const startingGNO = argv.t2 || toWei(10, 'ether')
    const ethUSDPrice = toWei(5000, 'ether')

    await Promise.all(accounts.map((acct) => {
      const otherToken = sell === 'eth' ? buyToken : sellToken
      return Promise.all([
        eth.deposit({ from: acct, value: startingETH }),
        eth.approve(dx.address, startingETH, { from: acct }),
        otherToken.transfer(acct, startingGNO, { from: master }),
        otherToken.approve(dx.address, startingGNO, { from: acct }),
      ])
    }))
    // Deposit depends on ABOVE finishing first... so run here
    await Promise.all(accounts.map(acct => Promise.all([
      dx.deposit(sellToken.address, startingETH, { from: acct }),
      dx.deposit(buyToken.address, startingGNO, { from: acct }),
    ])))

    await oracle.post(ethUSDPrice, toBN(1516168838).mul(toBN(2)), medianizer.address, { from: master })

    console.log('Threshold new token pair == ', (await dx.thresholdNewTokenPair.call()).toString() / (10 ** 18))

    console.log('Account', accountName)
    console.log('Sell Token = ', sell, '|| BAL == ', (await dx.balances.call(sellToken.address, account)).toString() / (10 ** 18))
    console.log('Buy Token = ', buy, ' @', buyToken.address, '|| BAL == ', (await dx.balances.call(buyToken.address, account)).toString() / (10 ** 18))

    console.log('FundingUSD == ', startingETH * ethUSDPrice)
    console.log('Auction Index BEFORE == ', (await dx.getAuctionIndex.call(sellToken.address, buyToken.address)).toString())

    const funds = sell === 'eth'
      ? [toWei(10, 'ether'), 0, 2, 1]
      : [0, toWei(10, 'ether'), 1, 2]

    await dx.addTokenPair(
      sellToken.address,                            // -----> SellToken Address
      buyToken.address,                           // -----> BuyToken Address
      ...funds,                                    // -----> sellFund, buyFund, closingPriceNum, closingPriceDen
      { from: account },
    )

    await mineCurrentBlock()
    console.log('Auction Index AFTER == ', (await dx.getAuctionIndex.call(sellToken.address, buyToken.address)).toString())
  } catch (error) {
    throw new Error(error)
  } finally {
    console.log('Exiting...')
    process.exit()
  }
}
