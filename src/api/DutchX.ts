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

  const getAuctionIndex = async (pair: TokenPair) => {
    const index = await getExchange(pair).auctionIndex()

    return index.toNumber()
  }

  const getClosingPrice = async (pair: TokenPair, index?: number) => {
    if (index === undefined) index = await getAuctionIndex(pair) - 1

    const [num, den] = getExchange(pair).closingPrices(index)

    return num.div(den).toString()
  }

  const getPrice = async (pair: TokenPair, index?: number) => {
    if (index === undefined) index = await getAuctionIndex(pair)

    const [num, den] = getExchange(pair).getPrice(index)

    return num.div(den).toString()
  }

  const getSellVolumeCurrent = async (pair: TokenPair) => {
    const vol = await getExchange(pair).sellVolumeCurrent()

    return vol.toString()
  }

  const getSellVolumeNext = async (pair: TokenPair) => {
    const vol = await getExchange(pair).sellVolumeNext()

    return vol.toString()
  }

  const getBuyVolume = async (pair: TokenPair, index?: number) => {
    if (index === undefined) index = await getAuctionIndex(pair)

    const vol = await getExchange(pair).buyVolumes(index)

    return vol.toString()
  }

  const getSellerBalances = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const balance = await getExchange(pair).sellerBalances(index, account)

    return await balance.toString()
  }

  const getBuyerBalances = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const balance = await getExchange(pair).buyerBalances(index, account)

    return balance.toString()
  }

  const getClaimedAmounts = async (pair: TokenPair, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    const balance = await getExchange(pair).buyerBalances(index, account)

    return balance.toString()
  }

  const postSellOrder = async (pair: TokenPair, amount: Balance, account?: Account) => {
    if (account === undefined) account = await getCurrentAccount()

    return getExchange(pair).postSellOrder(amount, { from: account })
  }

  const postBuyOrder = async (pair: TokenPair, amount: Balance, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).postBuyOrder(amount, index, { from: account })
  }

  const postBuyOrderAndClaim = async (pair: TokenPair, amount: Balance, index?: number, account?: Account) => {
    [index, account] = await fillDefaultIndexAndAccount(pair, index, account)

    return getExchange(pair).postBuyorderAndClaim(amount, index, { from: account })
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
    getAuctionIndex,
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
