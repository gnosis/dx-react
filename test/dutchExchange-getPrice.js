/* eslint no-console:0, max-len:0, no-plusplus:0, no-mixed-operators:0, no-trailing-spaces:0 */

const bn = require('bignumber.js')

const { 
  eventWatcher,
  logger,
  timestamp,
} = require('./utils')

const {
  setupTest,
  getContracts,
  getAuctionIndex,
  checkBalanceBeforeClaim,
  waitUntilPriceIsXPercentOfPreviousPrice,
  setAndCheckAuctionStarted,
  postBuyOrder,
  calculateTokensInExchange,
} = require('./testFunctions')

// Test VARS
let eth
let gno
let dx
let oracle
let tokenTUL
let balanceInvariant
const ether = 10 ** 18

let contracts

const valMinusFee = amount => amount - (amount / 200)

const setupContracts = async () => {
  contracts = await getContracts();
  // destructure contracts into upper state
  ({
    DutchExchange: dx,
    EtherToken: eth,
    TokenGNO: gno,
    TokenTUL: tokenTUL,
    PriceOracleInterface: oracle,
  } = contracts)
}
const startBal = {
  startingETH: 90.0.toWei(),
  startingGNO: 90.0.toWei(),
  ethUSDPrice: 1008.0.toWei(),
  sellingAmount: 50.0.toWei(), // Same as web3.toWei(50, 'ether')
}


contract('DutchExchange - getPrice', (accounts) => {
  const [, seller1, , buyer1, buyer2] = accounts


  before(async () => {
    // get contracts
    await setupContracts()

    // set up accounts and tokens[contracts]
    await setupTest(accounts, contracts, startBal)

    // add tokenPair ETH GNO
    await dx.addTokenPair(
      eth.address,
      gno.address,
      10 * ether,
      0,
      2,
      1,
      { from: seller1 },
    )

    eventWatcher(dx, 'Log', {})
  })

  after(eventWatcher.stopWatching)

  it('1. check that getPrice returns the right value according to time for a normal running auction', async () => {
    const auctionIndex = await getAuctionIndex()
    await setAndCheckAuctionStarted(eth, gno)
    const auctionStart = (await dx.getAuctionStart(eth.address, gno.address)).toNumber

    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1.5)
    let num, den 
    [num, den] = (await dx.getPriceForJS(eth.address, gno.address, auctionIndex))
    const currenttime = timestamp()
    let numPrevious, denPrevious 
    [numPrevious, denPrevious] = (await dx.computeRatioOfHistoricalPriceOracles(eth.address, gno.address, auctionIndex - 1))
    const timeElapsed = currenttime - auctionStart 
    assert.equal(num, bn((86400 - timeElapsed)).mul(numPrevious))
    assert.equal(den, bn((timeElapsed + 43200)).mul(denPrevious))
  })

  it('2. check that getPrice returns the right value (closing Price ) for a theoretical closed auction', async () => {
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1)
    await postBuyOrder(eth, gno, 5 * 10e17, buyer1)
    await postBuyOrder(eth, gno, 5 * 10e17, buyer2)
    // closing theoretical
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 0.4)
    
    // check prices:  - actually reduantant with tests postBuyOrder
    const closingPriceNum = (await dx.buyVolumes(eth.address, gno.address)).toNumber
    const closingPriceDen = (await dx.sellVolumesCurrent(eth.address, gno.address)).toNumber

      [num, den] = (await dx.getPriceForJS(eth.address, gno.address, auctionIndex))

    assert.equal(closingPriceNum, num)
    assert.equal(closingPriceDen, den)
  })


  it('3. check that getPrice returns the (0,0) for future auctions', async () => {
    const auctionIndex = 1 
    /* -- claim Buyerfunds - function does this:
    * 1. balanceBeforeClaim = (await dx.balances.call(eth.address, buyer1)).toNumber()
    * 2. await dx.claimBuyerFunds(eth.address, gno.address, buyer1, auctionIndex)
    * 3. assert.equal(balanceBeforeClaim + 10 ** 9 - (await dx.balances.call(eth.address, buyer1)).toNumber() < MaxRoundingError, true)
    */
    await checkBalanceBeforeClaim(buyer1, auctionIndex, 'buyer', eth, gno, valMinusFee(10 * ether), 100000)

    // claim Sellerfunds
    await checkBalanceBeforeClaim(seller1, auctionIndex, 'seller', eth, gno, valMinusFee(10 * ether * 3), 10 ** 17)

    // check prices:  - actually reduantant with tests postBuyOrder
    const [closingPriceNum, closingPriceDen] = (await dx.closingPrices.call(eth.address, gno.address, 1))
    await checkInvariants(balanceInvariant, accounts, [eth, gno])
    assert.equal(closingPriceNum.minus(closingPriceDen.mul(3)).abs().toNumber() < 10 ** 17, true)
  })

  it('4. check that getPrice returns the averaged price for historical prices.', async () => {
    const auctionIndex = 1 
    /* -- claim Buyerfunds - function does this:
    * 1. balanceBeforeClaim = (await dx.balances.call(eth.address, buyer1)).toNumber()
    * 2. await dx.claimBuyerFunds(eth.address, gno.address, buyer1, auctionIndex)
    * 3. assert.equal(balanceBeforeClaim + 10 ** 9 - (await dx.balances.call(eth.address, buyer1)).toNumber() < MaxRoundingError, true)
    */
    await checkBalanceBeforeClaim(buyer1, auctionIndex, 'buyer', eth, gno, valMinusFee(10 * ether), 100000)

    // claim Sellerfunds
    await checkBalanceBeforeClaim(seller1, auctionIndex, 'seller', eth, gno, valMinusFee(10 * ether * 3), 10 ** 17)

    // check prices:  - actually reduantant with tests postBuyOrder
    const [closingPriceNum, closingPriceDen] = (await dx.closingPrices.call(eth.address, gno.address, 1))
    await checkInvariants(balanceInvariant, accounts, [eth, gno])
    assert.equal(closingPriceNum.minus(closingPriceDen.mul(3)).abs().toNumber() < 10 ** 17, true)
  })
})
