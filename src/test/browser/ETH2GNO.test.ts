import expect from 'expect'

import DXart from '../../../build/contracts/DutchExchangeETHGNO.json'
import ETHart from '../../../build/contracts/TokenETH.json'
import GNOart from '../../../build/contracts/TokenGNO.json'
import TULart from '../../../build/contracts/Token.json'

import TC from 'truffle-contract'
import Web3 from 'web3'

const DX = TC(DXart)
const ETH = TC(ETHart)
const GNO = TC(GNOart)
const TUL = TC(TULart)

const currentProvider = typeof window !== 'undefined' && window.web3 && window.web3.currentProvider
console.log('currentProvider', currentProvider)

// when running testrpc via truffle develop change port to 9545
const localProvider = new Web3.providers.HttpProvider('http://localhost:8545')
// Metamask returns only current account from web3.eth.accounts
// so we get all accounts from local testrpc instance
const web3 = new Web3(localProvider)

DX.setProvider(localProvider)
ETH.setProvider(localProvider)
GNO.setProvider(localProvider)
TUL.setProvider(localProvider)

console.log('accounts', web3.eth.accounts)

const delay = (timeout = 20000) => new Promise((res) => {
  console.log(`start delay ${timeout / 1000} sec`)

  setTimeout(() => (console.log('end delay'), res()), timeout)
})

const metamaskWarning = (acc: string, addr: string) =>
  console.log(`If testing with METAMASK you need to be on the ${acc} (${addr}) account`)


describe('ETH 2 GNO contract', () => {
  // TODO: proper types
  let dx: any, eth: any, gno: any, tul: any
  const [master, seller, buyer]: string[] = web3.eth.accounts
  // if Metamask is injected, switch to its provider
  currentProvider && web3.setProvider(currentProvider)

  let dxa: string

  const accs = { master, seller, buyer }

  // delays interaction so that we can switch accounts in Metamask
  // if running without metamask -- no delay
  const delayFor = (name: string) => currentProvider && (metamaskWarning(name, accs[name]), delay())

  // TODO: snapshot testrpc state
  // WORKAROUND: truffle migrate --reset before tests


  before(async () => {
    dx = await DX.deployed()
    dxa = DX.address
    eth = await ETH.deployed()
    gno = await GNO.deployed()
    tul = await TUL.deployed()

    // seller must have initial balance of ETH
    // allow a transfer
    await eth.approve(seller, 100, { from: master })
    console.log('master approved seller to withdraw 100 ETH')

    // transfer initial balance of 100 ETH
    await eth.transferFrom(master, seller, 100, { from: seller })
    // same as
    // await eth.transfer(seller, 100, { from: master })
    console.log('seller', seller, 'received 100 ETH')


    // buyer must have initial balance of GNO
    // allow a transfer
    await gno.approve(buyer, 1000, { from: master })
    console.log('master approved buyer to withdraw 1000 GNO')

    // transfer initial balance of 1000 GNO
    await gno.transferFrom(master, buyer, 1000, { from: buyer })
    console.log('buyer', buyer, 'received 1000 GNO')

    // if Metamask is injected, use it for interaction with DX
    // by switching providers to it
    currentProvider && DX.setProvider(currentProvider)
  })


  it('contracts are deployed', () => {
    expect(dx && eth && gno && tul).toBeTruthy()
  })


  it('accounts are available', () => {
    [master, seller, buyer].forEach(address => expect(address).toMatch(/^0x\w{40}$/))
  })



  it('contracts are deployed with expected initial data', async () => {
    // initial price is set
    let initialClosingPrice = await dx.closingPrices(0)
    initialClosingPrice = initialClosingPrice.map((x: any) => x.toNumber())

    expect(initialClosingPrice).toEqual([2, 1])

    // sell token is set
    const ETHaddress = await dx.sellToken()
    expect(ETHaddress).toBe(ETH.address)

    // buy token is set
    const GNOaddress = await dx.buyToken()
    expect(GNOaddress).toBe(GNO.address)

    // TUL token is set
    const TULaddress = await dx.TUL()
    expect(TULaddress).toBe(TUL.address)
  })

  it('master is ETH and GNO owner', async () => {
    const ETHowner = await eth.owner()
    const GNOowner = await gno.owner()

    expect(master).toBe(ETHowner)
    expect(master).toBe(GNOowner)
  })

  it('all accounts have the right balance', async () => {
    const ETHtotal = await eth.getTotalSupply()
    const masterETHBalance = await eth.balanceOf(master)
    const sellerETHBalance = await eth.balanceOf(seller)

    const GNOtotal = await gno.getTotalSupply()
    const masterGNOBalance = await gno.balanceOf(master)
    const buyerGNOBalance = await gno.balanceOf(buyer)

    expect(masterETHBalance.add(sellerETHBalance)).toEqual(ETHtotal)
    expect(masterGNOBalance.add(buyerGNOBalance)).toEqual(GNOtotal)
  })

  // TODO: rework to make a part of submit -> buy -> claim flow
  it('seller can submit order to an auction', async () => {
    const amount = 30

    await delayFor('seller')

    // allow the contract to move tokens
    await eth.approve(dxa, amount, { from: seller })

    // currently in auction
    const emptyAuctionVol = await dx.sellVolumeCurrent()
    expect(emptyAuctionVol.toNumber()).toBe(0)

    // seller submits order and returns transaction object
    // that includes logs of events that fired during function execution
    const { logs: [log] } = await dx.postSellOrder(amount, { from: seller, gas: 4712388 })
    const { _auctionIndex, _from, amount: submittedAmount } = log.args

    // submitter is indeed the seller
    expect(_from).toBe(seller)
    // amount is the same
    expect(submittedAmount.toNumber()).toBe(amount)

    // currently in auction
    const filledAuctionVol = await dx.sellVolumeCurrent()

    // auction received the exact sum from the seller
    expect(filledAuctionVol.add(emptyAuctionVol).toNumber()).toEqual(amount)

    // seller is now assigned a balance
    const sellerBalance = await dx.sellerBalances(_auctionIndex, seller)
    expect(sellerBalance.toNumber()).toEqual(amount)
  })

  it('auction is started', async () => {
    const auctionIndex = (await dx.auctionIndex()).toNumber()

    // still on the first auction
    expect(auctionIndex).toBe(1)
    const auctionStart = (await dx.auctionStart()).toNumber()
    let now = (await dx.now()).toNumber()

    // auction hasn't started yet
    expect(auctionStart).toBeGreaterThan(now)
    const timeUntilStart = auctionStart - now

    // move time to start + 1 hour
    await dx.increaseTimeBy(1, timeUntilStart, { from: master })
    now = (await dx.now()).toNumber()

    const getPrice = async (ind: number) => (await dx.getPrice(ind)).map((n: any) => n.toNumber())
    const [num, den] = await getPrice(auctionIndex)
    const [lastNum, lastDen] = await getPrice(auctionIndex - 1)

    // current num/den are derived from last closing price according to formula in DutchExchange.getPrice
    // that is double the last closing price minus function of time passed
    expect(36000 * lastNum).toBe(num)
    expect((now - auctionStart + 18000) * lastDen).toBe(den)
  })
})
