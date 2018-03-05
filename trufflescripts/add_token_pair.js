/* eslint no-console:0, no-multi-spaces:0, prefer-destructuring:1 */
const { updateExchangeParams } = require('./utils/contracts')(artifacts)

const TokenETH = artifacts.require('EtherToken')
const TokenGNO = artifacts.require('TokenGNO')
const TokenOWL = artifacts.require('TokenOWL')
const PriceOracle = artifacts.require('PriceFeed')
const Medianizer = artifacts.require('Medianizer')
const DutchExchange = artifacts.require('DutchExchange')
const Proxy = artifacts.require('Proxy')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec trufflescripts/add_token_pair.js
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
  const { accounts } = web3.eth
  const [master, seller, buyer] = accounts

  let account, accountName
  if (argv.a) account = accountName = argv.a
  else if (argv.seller) {
    account = seller
    accountName = 'Seller'
  } else if (argv.buyer) {
    account = buyer
    accountName = 'Buyer'
  } else {
    account = master
    accountName = 'Master'
  }

  const dx = await DutchExchange.at(Proxy.address)
  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()
  const owl = await TokenOWL.deployed()
  const rdn = await TokenGNO.new(web3.toWei(10000, 'ether'), { from: master })
  const omg = await TokenGNO.new(web3.toWei(10000, 'ether'), { from: master })
  // const oracle = await PriceOracle.deployed()
  // const medianizer = await Medianizer.deployed()

  const availableTokens = {
    eth,
    gno,
    owl,
    rdn,
    omg,
  }

  const [sell, buy] = argv.pair ? argv.pair.split(',') : ['eth', 'gno']

  const sellToken = availableTokens[sell.toLowerCase()]
  const buyToken = availableTokens[buy.toLowerCase()]

  const startingT1 = argv.t1 || 500
  const startingT2 = argv.t2 || 10
  const ethUSDPrice = 5000

  try {
    await Promise.all(accounts.map((acct) => {
      const otherToken = sell === 'eth' ? buyToken : sellToken
      return Promise.all([
        eth.deposit({ from: acct, value: startingT1 }),
        eth.approve(dx.address, startingT1, { from: acct }),
        otherToken.transfer(acct, startingT2, { from: master }),
        otherToken.approve(dx.address, startingT2, { from: acct }),
      ])
    }))

    // Deposit depends on ABOVE finishing first... so run here
    await Promise.all(accounts.map(acct => Promise.all([
      dx.deposit(sellToken.address, startingT1, { from: acct }),
      // dx.deposit(buyToken.address, startingT2, { from: acct }),
    ])))

    // await oracle.post(ethUSDPrice, 1516168838 * 2, medianizer.address, { from: master })

    await updateExchangeParams({
      thresholdNewTokenPair: 0,
      thresholdNewAuction: 0,
    })

    console.log('Threshold new token pair == ', (await dx.thresholdNewTokenPair.call()).toNumber() / (10 ** 18))

    console.log('Account', accountName)
    console.log('Sell Token = ', sell, '|| BAL == ', (await dx.balances.call(sellToken.address, account)).toNumber() / (10 ** 18))
    console.log('Buy Token = ', buy, '|| BAL == ', (await dx.balances.call(buyToken.address, account)).toNumber() / (10 ** 18))

    console.log('FundingUSD == ', startingT1 * ethUSDPrice)
    console.log('Auction Index == ', (await dx.getAuctionIndex.call(sellToken.address, buyToken.address)).toNumber())


    const funds = sell === 'eth' ?
      [10, 0, 2, 1] :
      [0, 10, 1, 2]

    await dx.addTokenPair(
      sellToken.address,      // -----> SellToken Address
      buyToken.address,      // -----> BuyToken Address
      ...funds,             // -----> sellFund, buyFund, closingPriceNum, closingPriceDen
      { from: account },
    )

    await updateExchangeParams({})
  } catch (e) {
    console.error(e)
  }
}
