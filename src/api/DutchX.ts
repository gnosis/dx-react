import { promisedContractsMap } from './contracts'
import { promisedWeb3 } from './web3Provider'
import { DutchExchange, Index, Filter, ErrorFirstCallback, DutchExchangeEvents } from './types'
import { TokenPair, Account, Balance, TokenCode } from 'types'

export const promisedDutchX = init()

const getCurrentAccount = async () => {
  const web3 = await promisedWeb3

  return web3.getCurrentAccount()
}

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
  const { DutchExchange: Dx } = await promisedContractsMap

  const fillDefaultIndexAndAccount = (pair: TokenPair, index?: Index, account?: Account) =>
    Promise.all<Index, Account>([
      index === undefined ? getLatestAuctionIndex(pair) : index,
      account === undefined ? getCurrentAccount() : account,
    ])


  const getLatestAuctionIndex = (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)
    return Dx.latestAuctionIndices(t1, t2)
  }

  const getAuctionStart = (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)
    return Dx.auctionStarts(t1, t2)
  }

  const getClosingPrice = async (pair: TokenPair, index?: Index) => {
    // defaults to last closed auction index
    if (index === undefined) index = (await getLatestAuctionIndex(pair)).sub(1)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.closingPrices(t1, t2, index)
  }

  const getPrice = async (pair: TokenPair, index?: Index) => {
    if (index === undefined) index = await getLatestAuctionIndex(pair)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.getPrice(t1, t2, index)
  }

  const getSellVolumeCurrent = async (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.sellVolumesCurrent(t1, t2)
  }

  const getSellVolumeNext = (pair: TokenPair) => {
    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.sellVolumesNext(t1, t2)
  }

  const getBuyVolume = async (pair: TokenPair, index?: Index) => {
    if (index === undefined) index = await getLatestAuctionIndex(pair)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.buyVolumes(t1, t2, index)
  }

  const getSellVolume = async (pair: TokenPair, index?: Index) => {
    if (index === undefined) index = await getLatestAuctionIndex(pair)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.sellVolumes(t1, t2, index)
  }

  const getExtraSellTokens = async (pair: TokenPair, index?: Index) => {
    if (index === undefined) index = await getLatestAuctionIndex(pair)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.extraSellTokens(t1, t2, index)
  }

  const getExtraBuyTokens = async (pair: TokenPair, index?: Index) => {
    if (index === undefined) index = await getLatestAuctionIndex(pair)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.extraBuyTokens(t1, t2, index)
  }

  const getSellerBalance = async (pair: TokenPair, index?: Index, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.sellerBalances(t1, t2, index, account)
  }

  const getBuyerBalance = async (pair: TokenPair, index?: Index, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.buyerBalances(t1, t2, index, account)
  }

  const getClaimedAmount = async (pair: TokenPair, index?: Index, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.claimedBalances(t1, t2, index, account)
  }

  const postSellOrder = async (
    pair: TokenPair,
    amount: Balance,
    amountOfWIZToBurn: Balance,
    index?: Index,
    account?: Account,
  ) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.postSellOrder(t1, t2, index, amount, amountOfWIZToBurn, { from: account, gas: 4712388 })
  }

  const postBuyOrder = async (
    pair: TokenPair,
    amount: Balance,
    amountOfWIZToBurn: Balance,
    index?: Index,
    account?: Account,
  ) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.postBuyOrder(t1, t2, index, amount, amountOfWIZToBurn, { from: account, gas: 4712388 })
  }

  // const postBuyOrderAndClaim = async (pair: TokenPair, amount: Balance, index?: Index, account?: Account) => {
  //   [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

  //   return Dx.postBuyorderAndClaim(amount, index, { from: account, gas: 4712388 })
  // }

  const claimSellerFunds = async (pair: TokenPair, index?: Index, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)
    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.claimSellerFuncds(t1, t2, account, index)
  }

  const claimBuyerFunds = async (pair: TokenPair, index?: Index, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)
    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.claimBuyerFunds(t1, t2, account, index)
  }

  const getUnclaimedBuyerFunds = async (pair: TokenPair, index?: Index, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)
    const [t1, t2] = getTokenPairAddresses(pair)

    return Dx.getUnclaimedBuyerFunds(t1, t2, account, index)
  }

  // const getUnclaimedSellerFunds = async (pair: TokenPair, index?: Index, account?: Account) => {
  //   [index, account] = await fillDefaultIndexAndAccount(pair, index, account)
  //   const [t1, t2] = getTokenPairAddresses(pair)

  //   return Dx.getUnclaimedSellerFunds(t1, t2, account, index)
  // }

  const deposit = async (code: TokenCode, amount: Balance, account?: Account) => {
    if (account === undefined) account = await getCurrentAccount()

    const token = getTokenAddress(code)

    return Dx.deposit(token, amount, { from: account })
  }

  const withdraw = async (code: TokenCode, amount: Balance, account?: Account) => {
    if (account === undefined) account = await getCurrentAccount()

    const token = getTokenAddress(code)

    return Dx.deposit(token, amount, { from: account })
  }

  const isTokenApproved = (code: TokenCode) => Dx.approvedTokens(getTokenAddress(code))

  const getBalance = async (code: TokenCode, account?: Account) => {
    if (account === undefined) account = await getCurrentAccount()

    const token = getTokenAddress(code)

    return Dx.balances(token, account)
  }

  const event: DutchExchange['event'] = (
    eventName: DutchExchangeEvents,
    valueFilter: object | void,
    filter: Filter,
    cb?: ErrorFirstCallback,
  ): any => {
    const event = Dx[eventName]

    if (typeof event !== 'function') throw new Error(`No event with ${eventName} name found on DutchExchange contract`)

    return event(valueFilter, filter, cb)
  }


  const allEvents: DutchExchange['allEvents'] = Dx.allEvents.bind(Dx)

  return {
    get address() {
      return Dx.address
    },
    isTokenApproved,
    getBalance,
    getLatestAuctionIndex,
    getAuctionStart,
    getClosingPrice,
    getPrice,
    getSellVolumeCurrent,
    getSellVolumeNext,
    getBuyVolume,
    getSellVolume,
    getExtraSellTokens,
    getExtraBuyTokens,
    getSellerBalance,
    getBuyerBalance,
    getClaimedAmount,
    postSellOrder,
    postBuyOrder,
    // postBuyOrderAndClaim,
    claimSellerFunds,
    claimBuyerFunds,
    getUnclaimedBuyerFunds,
    // getUnclaimedSellerFunds,
    deposit,
    withdraw,
    event,
    allEvents,
  }
}
