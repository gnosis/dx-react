const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')
const TokenGNO = artifacts.require('./TokenGNO.sol')

const argv = require('minimist')(process.argv.slice(2), { string: 'a' })

/**
 * truffle exec trufflescripts/buy_order.js
 * to post a buy order to the current auction as the buyer
 * @flags:
 * --seller      as the seller
 * -a <address>  as the given account
 * --clear       enough to clear an auction
 * -n <number>   for a specific amount
 */


module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()
  const gno = await TokenGNO.deployed()

  const auctionIndex = (await dx.auctionIndex()).toNumber()

  let buyer
  if (argv.a) buyer = argv.a
  else if (argv.seller)[, buyer] = web3.eth.accounts
  else {
    [, , buyer] = web3.eth.accounts
  }

  const buyerStats = () => Promise.all([
    dx.buyVolumes(auctionIndex),
    dx.buyerBalances(auctionIndex, buyer),
    gno.balanceOf(buyer),
  ]).then(res => res.map(n => n.toNumber()))

  let [buyVolume, buyerBalance, buyerGNOBalance] = await buyerStats()

  console.log(`Auction index ${auctionIndex}
    was:
    buyVolume:\t${buyVolume}
    buyerBalance:\t${buyerBalance} in auction
    \t\t${buyerGNOBalance} GNO in account
  `)

  try {
    let amount

    const [nom, den] = (await dx.getPrice(auctionIndex)).map(n => n.toNumber())
    const sellVolumeCurrent = (await dx.sellVolumeCurrent()).toNumber()

    const amountToClearAuction = Math.floor(sellVolumeCurrent * nom / den) - buyVolume

    if (argv.clear) {
      console.log(`
        Posting order for ${amountToClearAuction},
        enough to clear the auction
      `)
      amount = amountToClearAuction
    } else if (argv.n !== undefined) {
      amount = argv.n
      const diff = argv.n - amountToClearAuction
      console.log(`
      Posting order for ${argv.n},
      ${diff >= 0 ? `which is ${diff} more than needed to clear the auction` : ''}
    `)
    } else {
      console.warn('No amount provided')
      return
    }

    await gno.approve(dx.address, amount, { from: buyer })
    await dx.postBuyOrder(amount, 1, { from: buyer })
  } catch (error) {
    console.error(error.message || error)
  }

  [buyVolume, buyerBalance, buyerGNOBalance] = await buyerStats()

  console.log(`now:
  buyVolume:\t${buyVolume}
  buyerBalance:\t${buyerBalance} in auction
  \t\t${buyerGNOBalance} GNO in account
`)
}
