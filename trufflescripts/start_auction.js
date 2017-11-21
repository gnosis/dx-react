// truffle exec trufflescripts/start_auction.js

const DutchExchangeETHGNO = artifacts.require('./DutchExchangeETHGNO.sol')

module.exports = async () => {
  const dx = await DutchExchangeETHGNO.deployed()
  const auctionStart = (await dx.auctionStart()).toNumber()
  const now = (await dx.now()).toNumber()
  const timeUntilStart = auctionStart - now
  // auctionStart is in the future
  if (timeUntilStart > 0) await dx.increaseTimeBy(1, timeUntilStart)

  const auctionIndex = (await dx.auctionIndex()).toNumber()
  console.log(`ETH -> GNO auction ${auctionIndex} started`)
}