/* eslint no-console:0, no-multi-spaces:0, prefer-destructuring:1 */

const TokenETH = artifacts.require('EtherToken')
const TokenGNO = artifacts.require('TokenGNO')
const PriceOracle = artifacts.require('PriceFeed')
const Medianizer = artifacts.require('Medianizer')
const DutchExchange = artifacts.require('DutchExchange')
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
 * --pair <sellToken,buyToken>    token pair auction, eth,gno by default
 */

module.exports = async () => {
  const accounts = web3.eth.accounts

  const dx = await DutchExchange.at(Proxy.address)
  const eth = await TokenETH.deployed()
  const gno = await TokenGNO.deployed()
  const rdn = await TokenGNO.new(web3.toWei(10000, 'ether'), { from: accounts[0] })
  const omg = await TokenGNO.new(web3.toWei(10000, 'ether'), { from: accounts[0] })
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

  const startingETH = argv.eth || web3.toWei(10, 'ether')
  const startingGNO = argv.gno || web3.toWei(10, 'ether')
  const ethUSDPrice = web3.toWei(5000, 'ether')

  await Promise.all(accounts.map((acct) => {
    /* eslint array-callback-return:0 */
    // if (acct === accounts[0]) return
    eth.deposit({ from: acct, value: startingETH })
    eth.approve(dx.address, startingETH, { from: acct })
    if (sell === 'eth') {
      buyToken.transfer(acct, startingGNO, { from: accounts[0] })
      buyToken.approve(dx.address, startingGNO, { from: acct })
    } else {
      sellToken.transfer(acct, startingGNO, { from: accounts[0] })
      sellToken.approve(dx.address, startingGNO, { from: acct })
    }
  }))
  // Deposit depends on ABOVE finishing first... so run here
  await Promise.all(accounts.map((acct) => {
    // if (acct === accounts[0]) return
    dx.deposit(sellToken.address, startingETH, { from: acct })
    dx.deposit(buyToken.address, startingGNO, { from: acct })
  }))

  await oracle.post(ethUSDPrice, 1516168838 * 2, medianizer.address, { from: accounts[0] })

  console.log('Threshold new token pair == ', (await dx.thresholdNewTokenPair.call()).toNumber() / (10 ** 18))
  console.log('Sell Token = ', sell, '|| BAL == ', (await dx.balances.call(sellToken.address, accounts[1])).toNumber() / (10 ** 18))
  console.log('Buy Token = ', buy, '|| BAL == ', (await dx.balances.call(buyToken.address, accounts[1])).toNumber() / (10 ** 18))
  // console.log('Buy Approved = ', buy, '|| APPRV == ', (await buy.allowance.call(accounts[1], dx.address)).toNumber() / (10 ** 18))
  console.log('FundingUSD == ', startingETH * ethUSDPrice)
  console.log('Auction Index == ', (await dx.getAuctionIndex.call(sellToken.address, buyToken.address)).toNumber())

  const funds = sell === 'eth' ?
    [web3.toWei(10, 'ether'), 0, 2, 1] :
    [0, web3.toWei(10, 'ether'), 1, 2]

  await dx.addTokenPair(
    sellToken.address,                            // -----> SellToken Address
    buyToken.address,                           // -----> BuyToken Address
    ...funds,                                    // -----> closingPriceDen
    { from: accounts[0] },
  )
}
