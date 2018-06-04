import { promisedContractsMap } from './contracts'
import { DutchExchange, Index, Filter, ErrorFirstCallback, DutchExchangeEvents } from './types'
import { TokenPair, Account, Balance, TokenCode } from 'types'

export const promisedDutchX = init()

async function init(): Promise<DutchExchange> {
  const { DutchExchange: dx } = await promisedContractsMap

  /* const token2Address = Object.keys(tokens).reduce((acc, key) => {
    const contr = tokens[key]
    acc[key.replace('Token', '')] = contr.address
    return acc
  }, {}) as T2A */

  const getLatestAuctionIndex = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair) =>
    dx.getAuctionIndex.call(t1, t2)

  const getAuctionStart = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair) =>
    dx.getAuctionStart.call(t1, t2)

  const getClosingPrice = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair, index: Index) =>
    dx.closingPrices.call(t1, t2, index)

  const getPrice = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair, index: Index) =>
    dx.getCurrentAuctionPrice.call(t1, t2, index)

  const getSellVolumesCurrent = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair) =>
    dx.sellVolumesCurrent.call(t1, t2)

  const getSellVolumesNext = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair) =>
    dx.sellVolumesNext.call(t1, t2)

  const getBuyVolumes = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair) =>
    dx.buyVolumes.call(t1, t2)

  const getExtraTokens = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair) =>
    dx.extraTokens.call(t1, t2)

  const getSellerBalances = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.sellerBalances.call(t1, t2, index, userAccount)

  const getBuyerBalances = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account) => dx.buyerBalances.call(t1, t2, index, userAccount)

  const getClaimedAmounts = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimedAmounts.call(t1, t2, index, userAccount)

  const postSellOrder = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => dx.postSellOrder(t1, t2, index, amount, { from: userAccount, gas: 4712388 })

  postSellOrder.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => dx.postSellOrder.call(t1, t2, index, amount, { from: userAccount })

  const postBuyOrder = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => dx.postBuyOrder(t1, t2, index, amount, { from: userAccount, gas: 4712388 })

  postBuyOrder.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => dx.postBuyOrder.call(t1, t2, index, amount, { from: userAccount, gas: 4712388 })

  const claimSellerFunds = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimSellerFunds(t1, t2, userAccount, index, { from: userAccount, gas: 4712388 })

  claimSellerFunds.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimSellerFunds.call(t1, t2, userAccount, index)

  const claimTokensFromSeveralAuctionsAsSeller = (
    sellTokenAddresses: Account[],
    buyTokenAddresses: Account[],
    indices: number[],
    account: Account,
  ) => dx.claimTokensFromSeveralAuctionsAsSeller(
    sellTokenAddresses,
    buyTokenAddresses,
    indices,
    account,
    { from: account },
  )

  const claimBuyerFunds = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimBuyerFunds(t1, t2, userAccount, index, { from: userAccount })

  claimBuyerFunds.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimBuyerFunds.call(t1, t2, userAccount, index)

  const deposit = (tokenAddress: Account, amount: Balance, userAccount: Account) =>
    dx.deposit(tokenAddress, amount, { from: userAccount })

  const withdraw = (tokenAddress: TokenCode, amount: Balance, userAccount: Account) =>
    dx.withdraw(tokenAddress, amount, { from: userAccount })

  const depositAndSell = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    userAccount: Account,
  ) => dx.depositAndSell(t1, t2, amount, { from: userAccount })

  depositAndSell.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
  ) => dx.depositAndSell.call(t1, t2, amount)

  const claimAndWithdraw = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    amount: Balance,
    userAccount: Account,
    ) => dx.claimAndWithdraw(t1, t2, userAccount, index, amount, { from: userAccount, gas: 4712388 })

  const isTokenApproved = (tokenAddress: Account) => dx.approvedTokens.call(tokenAddress)

  const getApprovedAddressesOfList = (tokenAddresses: Account[]) => dx.getApprovedAddressesOfList.call(tokenAddresses)

  const getBalance = (tokenAddress: Account, userAccount: Account) =>
    dx.balances.call(tokenAddress, userAccount)

  const getRunningTokenPairs = (tokenList: Account[]) => dx.getRunningTokenPairs.call(tokenList)

  const getSellerBalancesOfCurrentAuctions = (
    sellTokenArr: Account[],
    buyTokenArr: Account[],
    userAccount: Account,
  ) => dx.getSellerBalancesOfCurrentAuctions.call(sellTokenArr, buyTokenArr, userAccount)

  const getIndicesWithClaimableTokensForSellers = (
    { sell: { address: sellToken }, buy: { address: buyToken } }: TokenPair,
    userAccount: Account,
    lastNAuctions: number = 0,
  ) => dx.getIndicesWithClaimableTokensForSellers.call(sellToken, buyToken, userAccount, lastNAuctions)

  const getFeeRatio = (userAccount: Account) => dx.getFeeRatio.call(userAccount)

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
    getApprovedAddressesOfList,
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
    getRunningTokenPairs,
    getSellerBalancesOfCurrentAuctions,
    getIndicesWithClaimableTokensForSellers,
    getClaimedAmounts,
    claimTokensFromSeveralAuctionsAsSeller,
    getFeeRatio,
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
