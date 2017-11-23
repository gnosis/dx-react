const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')
const TokenETH = artifacts.require('./TokenETH.sol')

const argv = require('minimist')(process.argv.slice(2))

/**
 * truffle exec trufflescripts/buy_order.js
 * to post a buy order to the current auction
 * @flags:
 * -n <number>   for a specific amount
 * -i <index>    to auction with given index
 */


module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()
  const eth = await TokenETH.deployed()

  const auctionIndex = argv.i !== undefined ? argv.i : (await dx.auctionIndex()).toNumber()

  const [, , seller] = web3.eth.accounts

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
    \t\t${sellerETHBalance} ETH in account
  `)

  if (argv.n === undefined) {
    console.warn('No amount provided')
    return
  }

  try {
    await eth.approve(dx.address, argv.n, { from: seller })
    const receipt = await dx.postSellOrder(argv.n, 1, { from: seller })
    console.log(receipt)
  } catch (error) {
    console.error(error.message || error)
  }

  [sellVolumeCurrent, sellVolumeNext, sellerBalance, sellerETHBalance] = await sellerStats()

  console.log(`now:
  sellVolumeCurrent:\t${sellVolumeCurrent}
  sellVolumeNext:\t${sellVolumeNext}
  sellerBalance:\t${sellerBalance} in auction
  \t\t${sellerETHBalance} ETH in account
`)
}
