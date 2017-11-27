const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')
const TokenETH = artifacts.require('./TokenETH.sol')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec trufflescripts/buy_order.js
 * to post a buy order to the current auction as the seller
 * @flags:
 * -n <number>   for a specific amount
 * --buyer      as the buyer
 * -a <address>  as the given account
 */


module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()
  const eth = await TokenETH.deployed()

  const auctionIndex = (await dx.auctionIndex()).toNumber()

  let seller
  if (argv.a) seller = argv.a
  else if (argv.buyer)[, , seller] = web3.eth.accounts
  else {
    [, seller] = web3.eth.accounts
  }

  const sellerStats = () => Promise.all([
    dx.sellVolumeCurrent(),
    dx.sellVolumeNext(),
    dx.sellerBalances(auctionIndex, seller),
    eth.balanceOf(seller),
  ]).then(res => res.map(n => n.toNumber()))

  let [sellVolumeCurrent, sellVolumeNext, sellerBalance, sellerETHBalance] = await sellerStats()

  console.log(`Auction index ${auctionIndex}
  was:
    sellVolumeCurrent:\t${sellVolumeCurrent}
    sellVolumeNext:\t${sellVolumeNext}
    sellerBalance:\t${sellerBalance} in auction
    \t\t\t${sellerETHBalance} ETH in account
  `)

  if (argv.n === undefined) {
    console.warn('No amount provided')
    return
  }

  console.log(`
  Posting order for ${argv.n}
  `)

  try {
    await eth.approve(dx.address, argv.n, { from: seller })
    await dx.postSellOrder(argv.n, { from: seller })
  } catch (error) {
    console.error(error.message || error)
  }

  [sellVolumeCurrent, sellVolumeNext, sellerBalance, sellerETHBalance] = await sellerStats()

  console.log(`  now:
    sellVolumeCurrent:\t${sellVolumeCurrent}
    sellVolumeNext:\t${sellVolumeNext}
    sellerBalance:\t${sellerBalance} in auction
    \t\t\t${sellerETHBalance} ETH in account
`)
}
