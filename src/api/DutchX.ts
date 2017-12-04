import { promisedContractsMap } from './contracts'
import { promisedWeb3 } from './web3Provider'
import { DutchExchange } from './types'
import { TokenPair, Account, Balance } from 'types'

export const promisedDutchX = init()

const getCurrentAccount = async () => {
  const web3 = await promisedWeb3

  return web3.getCurrentAccount()
}

async function init(): Promise<DutchExchange> {
  const contractsMap = await promisedContractsMap

  const getExchange = ({ sell, buy }: TokenPair) => {
    const exchange = contractsMap[`DutchExchange${sell}${buy}`]

    if (!exchange) throw new Error(`No DutchExchange contract for ${sell}->${buy} token pair`)

    return exchange
  }

  const fillDefaultIndexAndAccount = (pair: TokenPair, index: number, account: Account) => Promise.all([
    index === undefined ? getAuctionIndex(pair) : index,
    account === undefined ? getCurrentAccount() : account,
  ])

  const getAddress = (pair: TokenPair) => getExchange(pair).address

  const getAuctionIndex = async (pair: TokenPair) => getExchange(pair).auctionIndex()

  const getAuctionStart = async (pair: TokenPair) => getExchange(pair).auctionStart()

  const getClosingPrice = async (pair: TokenPair, index?: number) => {
    if (index === undefined) index = await getAuctionIndex(pair) - 1

    return getExchange(pair).closingPrices(index)
  }

  const getPrice = async (pair: TokenPair, index?: number) => {
    if (index === undefined) index = await getAuctionIndex(pair)

    return getExchange(pair).getPrice(index)
  }

  const getSellVolumeCurrent = async (pair: TokenPair) => getExchange(pair).sellVolumeCurrent()

  const getSellVolumeNext = (pair: TokenPair) => getExchange(pair).sellVolumeNext()

  const getBuyVolume = async (pair: TokenPair, index?: number) => {
    if (index === undefined) index = await getAuctionIndex(pair)

    return getExchange(pair).buyVolumes(index)
  }

  const getSellerBalances = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).sellerBalances(index, account)
  }

  const getBuyerBalances = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).buyerBalances(index, account)
  }

  const getClaimedAmounts = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).claimedAmounts(index, account)
  }

  const postSellOrder = async (pair: TokenPair, amount: Balance, account?: Account) => {
    if (account === undefined) account = await getCurrentAccount()

    return getExchange(pair).postSellOrder(amount, { from: account, gas: 4712388 })
  }

  const postBuyOrder = async (pair: TokenPair, amount: Balance, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).postBuyOrder(amount, index, { from: account, gas: 4712388 })
  }

  const postBuyOrderAndClaim = async (pair: TokenPair, amount: Balance, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).postBuyorderAndClaim(amount, index, { from: account, gas: 4712388 })
  }

  const claimSellerFunds = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).claimSellerFunds(index, { from: account })
  }

  const claimBuyerFunds = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).claimBuyerFunds(index, { from: account })
  }

  return {
    getAddress,
    getAuctionIndex,
    getAuctionStart,
    getClosingPrice,
    getPrice,
    getSellVolumeCurrent,
    getSellVolumeNext,
    getBuyVolume,
    getSellerBalances,
    getBuyerBalances,
    getClaimedAmounts,
    postSellOrder,
    postBuyOrder,
    postBuyOrderAndClaim,
    claimSellerFunds,
    claimBuyerFunds,
  }
}
