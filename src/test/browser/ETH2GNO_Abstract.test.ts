import expect from 'expect'

import web3Utils from '../utils/trufflescriptsUtils.js'

import {
  // getCurrentAccount,
  getAllAccounts,
  // getCurrentBalance,
  // getETHBalance,
  getTokenBalance,
  // getTokenBalances,
  postSellOrder,
  closingPrice,
} from 'api/'
import { promisedTokens } from 'api/Tokens'
import { promisedDutchX } from 'api/dutchx'

import { contractsMap, promisedContractsMap } from 'api/contracts'
import { TokensInterface, DutchExchange } from 'api/types'
import { TokenPair } from 'types'

// import DXart from '../../../build/contracts/DutchExchangeETHGNO.json'
// import TC from 'truffle-contract'
import Web3 from 'web3'

// Check curr Provider - useful when switching between local and Metamask Providers
const currentProvider = typeof window !== 'undefined' && window.web3 && window.web3.currentProvider
// when running testrpc via truffle develop change port to 9545
const localProvider = new Web3.providers.HttpProvider('http://localhost:8545')

// Metamask returns only current account from web3.eth.accounts
// so we get all accounts from local testrpc instance
const web3 = new Web3(localProvider)
const { getTime, increaseTimeBy, setTime } = web3Utils(web3)

describe('ETH 2 GNO contract via DutchX Class', () => {
  // TODO: proper types
  // let dxClass: any
  let DX: any
  let ETH: any; let GNO: any; let TUL: any
  let dxa: string
  let dx: any; let eth: any; let gno: any; let tul: any

  let getTotalSupply: TokensInterface['getTotalSupply']
  let approve: TokensInterface['approve']
  let transfer: TokensInterface['transfer']
  let transferFrom: TokensInterface['transferFrom']

  let getLatestAuctionIndex: DutchExchange['getLatestAuctionIndex']
  let getSellVolumesCurrent: DutchExchange['getSellVolumesCurrent']
  let getSellVolumesNext: DutchExchange['getSellVolumesNext']
  let getAuctionStart: DutchExchange['getAuctionStart']
  let getPrice: DutchExchange['getPrice']
  let getBuyVolumes: DutchExchange['getBuyVolumes']
  let getSellerBalances: DutchExchange['getSellerBalances']
  let getBuyerBalances: DutchExchange['getBuyerBalances']
  let getClaimedAmounts: DutchExchange['getClaimedAmounts']
  let claimSellerFunds: DutchExchange['claimSellerFunds']
  let claimBuyerFunds: DutchExchange['claimBuyerFunds']
  let postBuyOrder: DutchExchange['postBuyOrder']

  const pair: TokenPair = {
    sell: { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 },
    buy: { name: 'GNOSIS', symbol: 'GNO', address: '', decimals: 18 } }

  let accounts: any; let accs: any

  let master: any; let seller: any; let buyer: any
  // let delayFor: any

  // TODO: snapshot testrpc state
  // WORKAROUND: truffle migrate --reset before tests

  before(async () => {
    ({ DutchExchange: DX, TokenMGN: TUL, TokenETH: ETH, TokenGNO: GNO } = contractsMap);
    ({ DutchExchange: dx, TokenMGN: tul, TokenETH: eth, TokenGNO: gno } = await promisedContractsMap())

    dxa = DX.address;

    ({ getTotalSupply, approve, transfer, transferFrom } = await promisedTokens());
    ({
      getLatestAuctionIndex,
      getAuctionStart,
      getSellVolumesCurrent,
      getSellVolumesNext,
      getPrice,
      getBuyVolumes,
      getSellerBalances,
      getBuyerBalances,
      getClaimedAmounts,
      claimSellerFunds,
      claimBuyerFunds,
      // @ts-ignore
      postBuyOrder,
    } = await promisedDutchX())

    // if currentProvider was injected by browser
    if (currentProvider) {
      // can't expect getAllAccounts() to return anything but the current account
      // so we get all accounts from local testrpc
      accounts = [...web3.eth.accounts]

      // explicitly set ONLY DutchExchangeETHGNO to the localProvider
      DX.setProvider(localProvider)
    } else {
      accounts = await getAllAccounts()
    }

    master = accounts[0]
    seller = accounts[1]
    buyer = accounts[2]

    accs = { master, seller, buyer }

    console.log(`MASTER ACCT = ${master}, SELLER ACCT = ${seller}, BUYER ACCT = ${buyer}`)

    // delays interaction so that we can switch accounts in Metamask
    // if running without metamask -- no delay
    // delayFor = (name: string) => currentProvider && (metamaskWarning(name, accs[name]), delay(15000))

    Object.assign(accs, { dx: DX.address, eth: ETH.address, gno: GNO.address, tul: TUL.addresss })

    watchAllEventsFor(dx, 'DutchExchange')
    watchAllEventsFor(eth, 'ETH')
    watchAllEventsFor(gno, 'GNO')

    // seller must have initial balance of ETH
    // allow a transfer
    await approve('ETH', seller, 100, { from: master })
    console.log('master approved seller to withdraw 100 ETH')

    // transfer initial balance of 100 ETH
    await transferFrom('ETH', master, seller, 100, { from: seller })
    console.log('seller', seller, 'received 100 ETH')

    // buyer must have initial balance of GNO
    // allow a transfer
    await approve('GNO', buyer, 1000, { from: master })
    console.log('master approved buyer to withdraw 1000 GNO')

    // transfer initial balance of 1000 GNO
    await transferFrom('GNO', master, buyer, 1000, { from: buyer })
    console.log('buyer', buyer, 'received 1000 GNO')

    // ONLY set Tokens to Metamask for approving txs
    currentProvider &&
      (ETH.setProvider(currentProvider) && GNO.setProvider(currentProvider) && TUL.setProvider(currentProvider))

    await checkBalances()
  })

  after(async () => {
    await checkBalances()
  })

  it('contracts are deployed', () => {
    expect(dx && eth && gno && tul).toBeTruthy()
  })

  it('accounts are available', () => {
    [master, seller, buyer].forEach(address => expect(address).toMatch(/^0x\w{40}$/))
  })

  it('contracts are deployed with expected initial data', async () => {
    // initial price is set
    const initialClosingPrice = (await closingPrice(pair, -1)).map(n => n.toNumber())

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
    const ETHtotal = await getTotalSupply('ETH')
    const masterETHBalance = await getTokenBalance('ETH', master)
    const sellerETHBalance = await getTokenBalance('ETH', seller)
    const buyerETHBalance = await getTokenBalance('ETH', buyer)

    const GNOtotal = await getTotalSupply('GNO')
    const masterGNOBalance = await getTokenBalance('GNO', master)
    const sellerGNOBalance = await getTokenBalance('GNO', seller)
    const buyerGNOBalance = await getTokenBalance('GNO', buyer)

    expect(masterETHBalance.add(sellerETHBalance).add(buyerETHBalance)).toEqual(ETHtotal)
    expect(masterGNOBalance.add(sellerGNOBalance).add(buyerGNOBalance)).toEqual(GNOtotal)
  })

  it('seller can submit order to an auction', async () => {
    const amount = '30'

    // currently in auction
    const emptyAuctionVol = await getSellVolumesCurrent(pair)
    expect(emptyAuctionVol.toNumber()).toBe(0)
    const aucIdx = (await getLatestAuctionIndex(pair)).toNumber()
    // seller submits order and returns transaction object
    // that includes logs of events that fired during function execution
    const { logs: [log] } = await postSellOrder(pair.sell, pair.buy, amount, aucIdx, seller)
    const { _auctionIndex, _from, amount: submittedAmount } = log.args

    // submitter is indeed the seller
    expect(_from).toBe(seller)
    // amount is the same
    expect(submittedAmount.toString()).toBe(amount)

    // currently in auction
    const filledAuctionVol = await getSellVolumesCurrent(pair)

    // auction received the exact sum from the seller
    expect(filledAuctionVol.add(emptyAuctionVol).toString()).toEqual(amount)

    // seller is now assigned a balance
    const sellerBalance = await getSellerBalances(pair, _auctionIndex, seller)
    expect(sellerBalance.toString()).toEqual(amount)
  })

  it('auction is started', async () => {
    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()

    // still on the first auction
    expect(auctionIndex).toBe(1)
    const auctionStart = (await getAuctionStart(pair)).toNumber()
    let now = getTime()

    // auction hasn't started yet
    expect(auctionStart).toBeGreaterThan(now)
    const timeUntilStart = auctionStart - now

    // move time to start + 1 hour
    increaseTimeBy(timeUntilStart + 3600)
    now = getTime()

    // auction has started
    expect(auctionStart).toBeLessThan(now)

    const getLocalPrice = async (ind: number) => (await getPrice(pair, ind)).map((n: any) => n.toNumber())
    const [num, den] = await getLocalPrice(auctionIndex)
    const [lastNum, lastDen] = await getLocalPrice(auctionIndex - 1)

    // current num/den are derived from last closing price according to formula in DutchExchange.getPrice
    // that is double the last closing price minus function of time passed
    expect(36000 * lastNum).toBe(num)
    expect((now - auctionStart + 18000) * lastDen).toBe(den)
  })

  it('buyer can submit a buy order', async () => {
    const amount = 10

    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()
    const claimed = (await getClaimedAmounts(pair, auctionIndex, buyer)).toNumber()
    const buyerBalance = (await getBuyerBalances(pair, auctionIndex, buyer)).toNumber()
    const buyVolume = (await getBuyVolumes(pair)).toNumber()

    // nothing yet claimed or bought
    expect(claimed).toBe(0)
    expect(buyerBalance).toBe(0)
    expect(buyVolume).toBe(0)

    // allow DX to withdraw GNO from buyer's account
    await approve('GNO', dxa, amount, { from: buyer })

    // submit a buy order for the current auction
    await postBuyOrder(pair, amount, auctionIndex, buyer)

    const buyerBalancesAfter = (await getBuyerBalances(pair, auctionIndex, buyer)).toNumber()
    const buyVolumeAfter = (await getBuyVolumes(pair)).toNumber()

    // buyer's balance increased
    expect(buyerBalance + amount).toBe(buyerBalancesAfter)
    // auction7s buy volume increased
    expect(buyVolumeAfter).toBe(buyVolume + amount)
    // there's only one buyer
    expect(buyerBalancesAfter).toBe(buyVolumeAfter)
  })

  it('buyer can claim the amount bought', async () => {
    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()
    const claimed = (await getClaimedAmounts(pair, auctionIndex, buyer)).toNumber()
    const buyerBalance = (await getBuyerBalances(pair, auctionIndex, buyer)).toNumber()
    const buyVolume = (await getBuyVolumes(pair)).toNumber()

    // nothing yet claimed
    expect(claimed).toBe(0)
    // something bought
    expect(buyerBalance).toBeGreaterThan(0)
    // by one buyer
    expect(buyVolume).toBe(buyerBalance)

    const [num, den] = (await getPrice(pair, auctionIndex)).map((n: any) => n.toNumber())

    await claimBuyerFunds(pair, auctionIndex, buyer)
    const claimedAmountAfter = (await getClaimedAmounts(pair, auctionIndex, buyer)).toNumber()
    const buyerBalancesAfter = (await getBuyerBalances(pair, auctionIndex, buyer)).toNumber()

    // return is a function of price, which itself is a function of time passed
    const expectedReturn = Math.floor(buyerBalancesAfter * den / num) - claimed
    const buyVolumeAfter = (await getBuyVolumes(pair)).toNumber()

    // claimed what it could
    expect(expectedReturn + claimed).toBe(claimedAmountAfter)
    // balance is kept as a record, just can't be claimed twice
    expect(buyerBalance).toBe(buyerBalancesAfter)
    expect(buyVolumeAfter).toBe(buyVolume)
  })

  it('buyer can\'t claim more at this time', async () => {
    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()
    try {

      await claimBuyerFunds(pair, auctionIndex, buyer)

      // break test if reached
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toContain('revert')
    }
  })

  it('seller can\'t claim before auction ended', async () => {

    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()
    try {
      // trying to claim from the ongoing auction
      await claimSellerFunds(pair, auctionIndex, seller)
      // break test if reached
      expect(true).toBe(false)
    } catch (error) {
      expect(error.message).toContain('revert')
    }
  })

  it('auction ends with time', async () => {
    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()

    const buyVolume = (await getBuyVolumes(pair)).toNumber()
    const sellVolume = (await getSellVolumesCurrent(pair)).toNumber()
    const auctionStart = (await getAuctionStart(pair)).toNumber()

    // Auction clears when sellVolume * price = buyVolume
    // Since price is a function of time, so we have to rearrange the equation for time, which gives
    const timeWhenAuctionClears = Math.ceil(72000 * sellVolume / buyVolume - 18000 + auctionStart)

    setTime(timeWhenAuctionClears)
    const buyerBalance = (await getBuyerBalances(pair, auctionIndex, buyer)).toNumber()
    const amount = 1
    await approve('GNO', dxa, amount, { from: buyer })
    await postBuyOrder(pair, amount, auctionIndex, buyer)
    const buyVolumeAfter = (await getBuyVolumes(pair)).toNumber()
    const buyerBalanceAfter = (await getBuyerBalances(pair, auctionIndex, buyer)).toNumber()

    // no changes, as the auction has ended
    expect(buyVolume).toBe(buyVolumeAfter)
    expect(buyerBalance).toBe(buyerBalanceAfter)

    const newAuctionIndex = (await getLatestAuctionIndex(pair)).toNumber()

    expect(newAuctionIndex).toBe(auctionIndex + 1)
  })

  it('next auction is scheduled', async () => {
    const auctionIndex = (await getLatestAuctionIndex(pair)).toNumber()

    // still on the first auction
    expect(auctionIndex).toBe(2)
    const auctionStart = (await getAuctionStart(pair)).toNumber()
    const now = getTime()

    // next auction hasn't started yet
    expect(auctionStart).toBeGreaterThan(now)
    // it will, in 6 hours
    expect(auctionStart).toBeLessThanOrEqual(now + 21600)
  })

  it('buyer can claim the remainder of the funds', async () => {
    const lastAuctionIndex = (await getLatestAuctionIndex(pair)).toNumber() - 1
    let claimed = (await getClaimedAmounts(pair, lastAuctionIndex, buyer)).toNumber()
    const buyerBalance = (await getBuyerBalances(pair, lastAuctionIndex, buyer)).toNumber()
    const buyVolume = (await getBuyVolumes(pair)).toNumber()

    // some funds were claimed
    expect(claimed).toBeGreaterThan(0)
    // there's non-zero buyers' balance
    expect(buyerBalance).toBeGreaterThan(0)
    // that belongs to one buyer
    expect(buyVolume).toBe(buyerBalance)
    // there are still funds to be claimed
    expect(claimed).toBeLessThan(buyerBalance)

    // claim what can be claimed
    await claimBuyerFunds(pair, lastAuctionIndex, buyer)
    claimed = (await getClaimedAmounts(pair, lastAuctionIndex, buyer)).toNumber()

    const [num, den] = (await getPrice(pair, lastAuctionIndex)).map((n: any) => n.toNumber())
    // assuming all buyerBalance got converted toETH at the closing price
    const balance2ETH = Math.floor(buyerBalance * den / num)

    // everything was claimed
    expect(claimed).toBe(balance2ETH)

  })

  it('seller can claim funds', async () => {

    const lastAuctionIndex = (await getLatestAuctionIndex(pair)).toNumber() - 1
    let sellerBalance = (await getSellerBalances(pair, lastAuctionIndex, seller)).toNumber()
    const [num, den] = (await getPrice(pair, lastAuctionIndex)).map((n: any) => n.toNumber())

    // transaction receipt includes amount returned
    const claimReceipt = await claimSellerFunds(pair, lastAuctionIndex, seller)

    const returned = claimReceipt.logs[0].args._returned.toNumber()

    // closing price * balance
    const expectedReturn = Math.floor(sellerBalance * num / den)
    expect(expectedReturn).toBe(returned)

    sellerBalance = (await getSellerBalances(pair, lastAuctionIndex, seller)).toNumber()
    // balance is drained
    expect(sellerBalance).toBe(0)
  })

  it('seller has some GNO tokens, buyer has some ETH', async () => {
    const buyerETHBalance = (await getTokenBalance('ETH', buyer)).toNumber()
    const sellerGNOBalance = (await getTokenBalance('GNO', seller)).toNumber()
    const buyerGNOBalance = (await getTokenBalance('GNO', buyer)).toNumber()
    const sellerETHBalance = (await getTokenBalance('ETH', seller)).toNumber()

    const masterGNOBalance = (await getTokenBalance('GNO', master)).toNumber()
    const masterETHBalance = (await getTokenBalance('ETH', master)).toNumber()

    const totalETH = (await getTotalSupply('ETH')).toNumber()
    const totalGNO = (await getTotalSupply('GNO')).toNumber()

    const sellerStartETH = totalETH - masterETHBalance
    const buyerStartGNO = totalGNO - masterGNOBalance

    // seller received GNO
    expect(sellerGNOBalance).toBeGreaterThan(0)
    // buyer received ETH
    expect(buyerETHBalance).toBeGreaterThan(0)

    // buyer received all ETH seller sent to aucion
    expect(sellerStartETH - sellerETHBalance).toBe(buyerETHBalance)
    // seller received all GNO buyer sent to auction
    const buyerGNODiff = buyerStartGNO - buyerGNOBalance
    expect(sellerGNOBalance).toBeLessThanOrEqual(buyerGNODiff)
    expect(sellerGNOBalance).toBeGreaterThanOrEqual(buyerGNODiff - 1)
  })

  async function checkBalances() {
    // don't spam browser console
    if (currentProvider) return

    const buyerETHBalance = (await getTokenBalance('ETH', buyer)).toNumber()
    const sellerGNOBalance = (await getTokenBalance('GNO', seller)).toNumber()
    const masterGNOBalance = (await getTokenBalance('GNO', master)).toNumber()
    const masterETHBalance = (await getTokenBalance('ETH', master)).toNumber()
    const buyerGNOBalance = (await getTokenBalance('GNO', buyer)).toNumber()
    const sellerETHBalance = (await getTokenBalance('ETH', seller)).toNumber()
    const totalETH = (await getTotalSupply('ETH')).toNumber()
    const totalGNO = (await getTotalSupply('GNO')).toNumber()

    console.log()
    console.log('  ETH\tGNO')
    console.log(`S ${sellerETHBalance}\t${sellerGNOBalance}`)
    console.log(`B ${buyerETHBalance}\t${buyerGNOBalance}`)
    console.log(`M ${masterETHBalance}\t${masterGNOBalance}`)
    console.log('__________________________')
    console.log(`= ${totalETH}\t${totalGNO}`)
  }

  function watchAllEventsFor(contract: any, name: string) {
    const addr2acc = Object.entries(accs)
      .reduce((accum, [name, addr]: [string, string]) => (accum[addr] = name, accum), {})
    contract.allEvents((err: Error, log: any) => {
      if (err) {
        console.error(err, name)
        return
      }
      const { args, event } = log
      for (const arg of Object.keys(args)) {
        const val = args[arg]
        if (val.toNumber) {
          // convert BigNumbers
          args[arg] = val.toNumber()
        } else if (typeof val === 'string' && /^0x\w{40}$/.test(val)) {
          args[arg] = addr2acc[val] || val
        }
      }

      console.log(`${name}::${event}`, args)
    })
  }

})
