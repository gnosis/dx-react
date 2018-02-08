import { promisedContractsMap } from './contracts'
import { DutchExchange, Index, Filter, ErrorFirstCallback, DutchExchangeEvents } from './types'
import { TokenPair, Account, Balance, TokenCode } from 'types'

export const promisedDutchX = init()

// TODO: get correct global addresses
// or create a json during migration
type T2A = Partial<{[P in TokenCode]: string}>

const token2Address: T2A = {
  ETH: '0x283hduie',
  GNO: '0x3u4376',
}

const getTokenAddress = (code: TokenCode) => {
  const address = token2Address[code]

  if (!address) throw new Error(`No known address for ${code} token`)

  return address
}

const getTokenPairAddresses = ({ sell, buy }: TokenPair): [Account, Account] => {
  const sellAddress = getTokenAddress(sell)
  const buyAddress = getTokenAddress(buy)

  return [sellAddress, buyAddress]
}

async function init(): Promise<DutchExchange> {
  const { DutchExchange: dx } = await promisedContractsMap

  const getLatestAuctionIndex = (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)
    return dx.latestAuctionIndices.call(t1, t2)
  }

  const getAuctionStart = (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)
    return dx.getAuctionStart.call(t1, t2)
  }

  const getClosingPrice = async (pair: TokenPair, index: Index) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.closingPrices.call(t1, t2, index)
  }

  const getPrice = async (pair: TokenPair, index: Index) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.getPriceForJS.call(t1, t2, index)
  }

  const getSellVolumesCurrent = async (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.sellVolumesCurrent.call(t1, t2)
  }

  const getSellVolumesNext = (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.sellVolumesNext.call(t1, t2)
  }

  const getBuyVolumes = async (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.buyVolumes.call(t1, t2)
  }

  const getExtraTokens = async (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.extraTokens.call(t1, t2)
  }

  const getSellerBalances = async (pair: TokenPair, index: Index, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.sellerBalances.call(t1, t2, index, account)
  }

  const getBuyerBalances = async (pair: TokenPair, index: Index, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.buyerBalances.call(t1, t2, index, account)
  }

  const getClaimedAmounts = async (pair: TokenPair, index: Index, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.claimedAmounts.call(t1, t2, index, account)
  }

  const postSellOrder = async (
    pair: TokenPair,
    amount: Balance,
    index: Index,
    account: Account,
  ) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.postSellOrder(t1, t2, index, amount, { from: account, gas: 4712388 })
  }

  const postBuyOrder = async (
    pair: TokenPair,
    amount: Balance,
    index: Index,
    account: Account,
  ) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.postBuyOrder(t1, t2, index, amount, { from: account, gas: 4712388 })
  }

  const claimSellerFunds = async (pair: TokenPair, index: Index, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.claimSellerFunds(t1, t2, account, index)
  }

  const claimBuyerFunds = async (pair: TokenPair, index: Index, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.claimBuyerFunds(t1, t2, account, index)
  }

  const deposit = async (code: TokenCode, amount: Balance, account: Account) => {
    const token = getTokenAddress(code)

    return dx.deposit(token, amount, { from: account })
  }

  const withdraw = async (code: TokenCode, amount: Balance, account: Account) => {
    const token = getTokenAddress(code)

    return dx.withdraw(token, amount, { from: account })
  }

  const depositAndSell = async (pair: TokenPair, amount: Balance, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.depositAndSell(t1, t2, amount, { from: account })
  }

  const claimAndWithdraw = async (pair: TokenPair, index: Index, amount: Balance, account: Account) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return dx.claimAndWithdraw(t1, t2, account, index, amount, { from: account })
  }

  const isTokenApproved = (code: TokenCode) => dx.approvedTokens(getTokenAddress(code))

  const getBalance = async (code: TokenCode, account: Account) => {
    const token = getTokenAddress(code)

    return dx.balances.call(token, account)
  }

  const event: DutchExchange['event'] = (
    eventName: DutchExchangeEvents,
    valueFilter: object | void,
    filter: Filter,
    cb?: ErrorFirstCallback,
  ): any => {
    const event = dx[eventName]

    if (typeof event !== 'function') throw new Error(`No event with ${eventName} name found on DutchExchange contract`)

    return event(valueFilter, filter, cb)
  }

  const allEvents: DutchExchange['allEvents'] = dx.allEvents.bind(dx)

  return {
    get address() {
      return dx.address
    },
    isTokenApproved,
    getBalance,
    getLatestAuctionIndex,
    getAuctionStart,
    getClosingPrice,
    getPrice,
    getSellVolumesCurrent,
    getSellVolumesNext,
    getBuyVolumes,
    getExtraTokens,
    getSellerBalances,
    getBuyerBalances,
    getClaimedAmounts,
    postSellOrder,
    postBuyOrder,
    claimSellerFunds,
    claimBuyerFunds,
    deposit,
    withdraw,
    depositAndSell,
    claimAndWithdraw,
    event,
    allEvents,
  }
}
