/* eslint no-console:0, max-len:0, no-plusplus:0, no-mixed-operators:0, no-trailing-spaces:0 */


/*
TUL token issuing will not be covered in these tests, as they are covered in the tulip testing scripts
*/

const bn = require('bignumber.js')

const { 
  eventWatcher,
  assertRejects,
  logger,
} = require('./utils')

const {
  setupTest,
  getContracts,
  getAuctionIndex,
  waitUntilPriceIsXPercentOfPreviousPrice,
  setAndCheckAuctionStarted,
  postBuyOrder,
  postSellOrder,
} = require('./testFunctions')

// Test VARS
let eth
let gno
let dx

let contracts

const valMinusFee = amount => amount - (amount / 200)


const setupContracts = async () => {
  contracts = await getContracts();
  // destructure contracts into upper state
  ({
    DutchExchange: dx,
    EtherToken: eth,
    TokenGNO: gno,
  } = contracts)
}
const startBal = {
  startingETH: 90.0.toWei(),
  startingGNO: 90.0.toWei(),
  ethUSDPrice: 1008.0.toWei(),
  sellingAmount: 50.0.toWei(), // Same as web3.toWei(50, 'ether')
}


contract('DutchExchange - claimBuyerFunds', (accounts) => {
  const [, seller1, seller2, buyer1, buyer2] = accounts
  const totalSellAmount2ndAuction = 10e18

  before(async () => {
    // get contracts
    await setupContracts()

    // set up accounts and tokens[contracts]
    await setupTest(accounts, contracts, startBal)

    // add tokenPair ETH GNO
    await dx.addTokenPair(
      eth.address,
      gno.address,
      10e18,
      0,
      2,
      1,
      { from: seller1 },
    )

    eventWatcher(dx, 'Log', {})
  })

  after(eventWatcher.stopWatching)

  it('1. check for a throw, if auctionIndex is bigger than the latest auctionIndex', async () => {
    const auctionIndex = await getAuctionIndex()
    await setAndCheckAuctionStarted(eth, gno)
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1.5)
    await assertRejects(dx.claimBuyerFunds(eth.address, gno.address, buyer1, auctionIndex + 1))
  })

  it(' 2. checks that the return value == 0, if price.num ==0 ', async () => {
    // prepare test by starting and clearning new auction
    let auctionIndex = await getAuctionIndex()
    await postSellOrder(gno, eth, 0, totalSellAmount2ndAuction, seller2)
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1)
    await postBuyOrder(eth, gno, auctionIndex, 2 * 10e18, buyer1)
    auctionIndex = await getAuctionIndex()
    await setAndCheckAuctionStarted(eth, gno)
    assert.equal(2, auctionIndex)

    // now claiming should not be possible and return == 0
    await setAndCheckAuctionStarted(eth, gno)
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1.5)
    const [closingPriceNum] = (await dx.closingPrices.call(gno.address, eth.address, auctionIndex - 1)).map(i => i.toNumber())
    assert.equal(closingPriceNum, 0)
    logger('here it is ')
    const [claimedAmount] = (await dx.claimBuyerFunds.call(gno.address, eth.address, buyer1, auctionIndex)).map(i => i.toNumber())
    assert.equal(claimedAmount, 0) 
  })
  it(' 3. checks that the non buyers can not claim any returns', async () => {
    const auctionIndex = await getAuctionIndex()
    const [claimedAmount] = (await dx.claimBuyerFunds.call(eth.address, gno.address, buyer1, auctionIndex)).map(i => i.toNumber())
    assert.equal(claimedAmount, 0) 
  })

  it('4. check right amount of coins is returned by claimBuyerFunds if auction is not closed', async () => {
    const auctionIndex = await getAuctionIndex()

    // prepare test by starting and closing theoretical auction
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1)

    await postBuyOrder(gno, eth, auctionIndex, totalSellAmount2ndAuction / 4, buyer2)

    // checking that closingPriceToken.num == 0
    const [closingPriceNumToken] = (await dx.closingPrices.call(eth.address, gno.address, auctionIndex)).map(i => i.toNumber())
    assert.equal(closingPriceNumToken, 0)
    
    // actual testing at time with previous price
    const [claimedAmount] = (await dx.claimBuyerFunds.call(gno.address, eth.address, buyer2, auctionIndex)).map(i => i.toNumber())
    const [num, den] = (await dx.getPriceForJS.call(gno.address, eth.address, auctionIndex)).map(i => i.toNumber())
    let sellVolume = (await dx.sellVolumesCurrent.call(gno.address, eth.address))
    let buyVolume = (await dx.buyVolumes.call(gno.address, eth.address))
    let oustandingVolume = (sellVolume.mul(bn(num)).toNumber() / den) - (buyVolume).toNumber()
    logger('oustandingVolume', oustandingVolume)
    logger('buyVolume', buyVolume)
    assert.equal((bn(valMinusFee(totalSellAmount2ndAuction)).mul(buyVolume).div(buyVolume.add(oustandingVolume))).toNumber(), claimedAmount)

    // actual testing at time with previous 2/3price
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 2 / 3)
    const [claimedAmount2] = (await dx.claimBuyerFunds.call(gno.address, eth.address, buyer2, auctionIndex)).map(i => i.toNumber())
    const [num2, den2] = (await dx.getPriceForJS.call(gno.address, eth.address, auctionIndex)).map(i => i.toNumber())
    sellVolume = (await dx.sellVolumesCurrent.call(gno.address, eth.address))
    buyVolume = (await dx.buyVolumes.call(gno.address, eth.address))
    oustandingVolume = (sellVolume.mul(bn(num2)).div(bn(den2))).sub(buyVolume)
    logger('oustandingVolume', oustandingVolume)
    logger('buyVolume', buyVolume)
    assert.equal((bn(valMinusFee(totalSellAmount2ndAuction)).mul(buyVolume).div(buyVolume.add(oustandingVolume))).toNumber(), claimedAmount2)
  })
})

contract('DutchExchange - claimBuyerFunds', (accounts) => {
  const [, seller1, buyer1] = accounts
  const totalSellAmount2ndAuction = 10e18

  before(async () => {
    // get contracts
    await setupContracts()

    // set up accounts and tokens[contracts]
    await setupTest(accounts, contracts, startBal)

    // add tokenPair ETH GNO
    await dx.addTokenPair(
      eth.address,
      gno.address,
      10e18,
      0,
      2,
      1,
      { from: seller1 },
    )

    eventWatcher(dx, 'Log', {})
  })

  after(eventWatcher.stopWatching)

  it('5. check right amount of coins is returned by claimBuyerFunds if auction is  not closed, but closed theoretical ', async () => {
    // prepare test by starting and clearning new auction
  
    const auctionIndex = await getAuctionIndex()
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1)
    await postBuyOrder(eth, gno, auctionIndex, 10e18, buyer1)
  

    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 0.4)

    // checking that closingPriceToken.num == 0
    const [closingPriceNumToken] = (await dx.closingPrices(eth.address, gno.address, auctionIndex)).map(i => i.toNumber())
    assert.equal(closingPriceNumToken, 0)
    
    // actual testing
    const [claimedAmount] = (await dx.claimBuyerFunds.call(eth.address, gno.address, buyer1, auctionIndex)).map(i => i.toNumber())
    // first halve has been withdraw in pre
    assert.equal(bn(valMinusFee(totalSellAmount2ndAuction)), claimedAmount)
  })
})


contract('DutchExchange - claimBuyerFunds', (accounts) => {
  const [, seller1, , buyer1] = accounts

  before(async () => {
    // get contracts
    await setupContracts()

    // set up accounts and tokens[contracts]
    await setupTest(accounts, contracts, startBal)

    // add tokenPair ETH GNO
    await dx.addTokenPair(
      eth.address,
      gno.address,
      10e18,
      0,
      2,
      1,
      { from: seller1 },
    )

    eventWatcher(dx, 'Log', {})
  })

  after(eventWatcher.stopWatching)

  it('6. check that already claimedBuyerfunds are substracted properly', async () => {
    // prepare test by starting and clearning new auction
  
    const auctionIndex = await getAuctionIndex()
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 1)
    await postBuyOrder(eth, gno, auctionIndex, 10e18, buyer1)

    // first withdraw  
    const [claimedAmount] = (await dx.claimBuyerFunds.call(eth.address, gno.address, buyer1, auctionIndex)).map(i => i.toNumber())
    await dx.claimBuyerFunds(eth.address, gno.address, buyer1, auctionIndex)
    
    const [num, den] = (await dx.getPriceForJS.call(eth.address, gno.address, auctionIndex))
    logger('num', num)
    logger('den', den)
    assert.equal((bn(valMinusFee(10e18)).div(num).mul(den)).toNumber(), claimedAmount)
    
    // second withdraw
    await waitUntilPriceIsXPercentOfPreviousPrice(eth, gno, 0.4)
    const [claimedAmount2] = (await dx.claimBuyerFunds.call(eth.address, gno.address, buyer1, auctionIndex)).map(i => i.toNumber())
    await dx.claimBuyerFunds(eth.address, gno.address, buyer1, auctionIndex)
    assert.equal((bn(valMinusFee(10e18)).sub(bn(valMinusFee(10e18)).div(num).mul(den))).toNumber(), claimedAmount2)
  })
})
