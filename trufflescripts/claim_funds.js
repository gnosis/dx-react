const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')

const argv = require('minimist')(process.argv.slice(2))

/**
 * truffle exec trufflescripts/claim_funds.js
 * to claim funds for the current auction for both seller and buyer
 * @flags:
 * --seller     for seller only
 * --buyer      for buyer only
 * -i <index>   for auction with given index
 * --last       for last auction
 */

module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()

  let auctionIndex = argv.i !== undefined ? argv.i : (await dx.auctionIndex()).toNumber()
  if (argv.i === undefined && argv.last) auctionIndex -= 1

  const [, seller, buyer] = web3.eth.accounts

  const sellerStats = () => Promise.all([
    dx.sellerBalances(auctionIndex, seller),
    dx.claimedAmounts(auctionIndex, seller),
  ]).then(res => res.map(n => n.toNumber()))

  const buyerStats = () => Promise.all([
    dx.buyerBalances(auctionIndex, buyer),
    dx.claimedAmounts(auctionIndex, buyer),
  ]).then(res => res.map(n => n.toNumber()))

  const printSeller = async () => {
    let [sellerBalance, sellerClaimed] = await sellerStats()

    console.log(`
    Seller\tbalance\tclaimed
    was:\t${sellerBalance}\t${sellerClaimed}`)

    try {
      await dx.claimSellerFunds(auctionIndex, { from: seller });

      [sellerBalance, sellerClaimed] = await sellerStats()

      console.log(`    is:\t\t${sellerBalance}\t${sellerClaimed}`)
    } catch (error) {
      console.error(error.message || error)
    }

  }

  const printBuyer = async () => {
    let [buyerBalance, buyerClaimed] = await buyerStats()

    console.log(`
    Buyer\tbalance\tclaimed
    was:\t${buyerBalance}\t${buyerClaimed}
    `)

    try {

      await dx.claimBuyerFunds(auctionIndex, { from: buyer });

      [buyerBalance, buyerClaimed] = await buyerStats()
      console.log(`    is:  ${buyerBalance} ${buyerClaimed}`)
    } catch (error) {
      console.error(error.message || error)
    }
  }

  console.log(`in auction ${auctionIndex}`)

  if (argv.seller) {
    await printSeller()
  } else if (argv.buyer) {
    await printBuyer()
  } else {
    await printSeller()
    await printBuyer()
  }
}
