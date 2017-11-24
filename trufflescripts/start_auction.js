const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')

/**
 * truffle exec trufflescripts/start_auction.js
 * if auction isn't running,
 * sets time to auction start + 1 hour
 */

module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()
  const auctionStart = (await dx.auctionStart()).toNumber()
  const now = (await dx.now()).toNumber()
  const timeUntilStart = auctionStart - now

  const auctionIndex = (await dx.auctionIndex()).toNumber()

  // auctionStart is in the future
  if (timeUntilStart > 0) {
    await dx.increaseTimeBy(1, timeUntilStart)
    console.log(`ETH -> GNO auction ${auctionIndex} started`)
  } else {
    console.log(`ETH -> GNO auction ${auctionIndex} is already running`)
  }
}
