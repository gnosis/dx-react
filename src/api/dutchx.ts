import { promisedContractsMap } from './contracts'
import { DutchExchange, Index, Filter, ErrorFirstCallback, DutchExchangeEvents } from './types'
import { TokenPair, Account, Balance, TokenCode } from 'types'
import { estimateGas } from 'utils'

let dutchXAPI: DutchExchange

export const promisedDutchX = async () => {
  if (dutchXAPI) return dutchXAPI

  dutchXAPI = await init()
  return dutchXAPI
}

async function init(): Promise<DutchExchange> {
  const { DutchExchange: dx, DutchExchangeHelper: dxHelper } = await promisedContractsMap()

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

  const getLastAuctionPrice = ({ sell: { address: t1 }, buy: { address: t2 } }: TokenPair, index: Index) =>
    dx.getPriceInPastAuction.call(t1, t2, index)

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

  const postSellOrder: DutchExchange['postSellOrder'] = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => estimateGas({ cb: dx.postSellOrder, mainParams: [t1, t2, index, amount], txParams: { from: userAccount } })

  postSellOrder.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => dx.postSellOrder.call(t1, t2, index, amount, { from: userAccount })

  postSellOrder.sendTransaction = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => estimateGas({ cb: dx.postSellOrder, mainParams: [t1, t2, index, amount], txParams: { from: userAccount } }, 'sendTransaction')

  const postBuyOrder = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) =>  estimateGas({ cb: dx.postBuyOrder, mainParams: [t1, t2, index, amount], txParams: { from: userAccount } })

  postBuyOrder.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    index: Index,
    userAccount: Account,
  ) => dx.postBuyOrder.call(t1, t2, index, amount, { from: userAccount })

  const claimSellerFunds = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => estimateGas({ cb: dx.claimSellerFunds, mainParams: [t1, t2, userAccount, index], txParams: { from: userAccount } })

  claimSellerFunds.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimSellerFunds.call(t1, t2, userAccount, index)

  const claimTokensFromSeveralAuctionsAsSeller: DutchExchange['claimTokensFromSeveralAuctionsAsSeller'] = (
    sellTokenAddresses: Account[],
    buyTokenAddresses: Account[],
    indices: number[],
    account: Account,
  ) => estimateGas({
    cb: dx.claimTokensFromSeveralAuctionsAsSeller,
    mainParams: [
      sellTokenAddresses,
      buyTokenAddresses,
      indices,
      account,
    ],
    txParams: { from: account },
  })

  claimTokensFromSeveralAuctionsAsSeller.sendTransaction = (
    sellTokenAddresses: Account[],
    buyTokenAddresses: Account[],
    indices: number[],
    account: Account,
  ) => estimateGas({
    cb: dx.claimTokensFromSeveralAuctionsAsSeller,
    mainParams: [
      sellTokenAddresses,
      buyTokenAddresses,
      indices,
      account,
    ],
    txParams: { from: account },
  }, 'sendTransaction')

  const claimAndWithdrawTokensFromSeveralAuctionsAsSeller: DutchExchange['claimAndWithdrawTokensFromSeveralAuctionsAsSeller'] = (
    sellTokenAddresses: Account[],
    buyTokenAddresses: Account[],
    indices: number[],
    account: Account,
  ) => estimateGas({
    cb: dx.claimAndWithdrawTokensFromSeveralAuctionsAsSeller,
    mainParams: [
      sellTokenAddresses,
      buyTokenAddresses,
      indices,
    ],
    txParams: { from: account },
  })

  claimAndWithdrawTokensFromSeveralAuctionsAsSeller.sendTransaction = (
    sellTokenAddresses: Account[],
    buyTokenAddresses: Account[],
    indices: number[],
    account: Account,
  ) => estimateGas({
    cb: dx.claimAndWithdrawTokensFromSeveralAuctionsAsSeller,
    mainParams: [
      sellTokenAddresses,
      buyTokenAddresses,
      indices,
    ],
    txParams: { from: account },
  }, 'sendTransaction')

  const claimBuyerFunds = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => estimateGas({ cb: dx.claimBuyerFunds, mainParams: [t1, t2, userAccount, index], txParams: { from: userAccount } })
  // dx.claimBuyerFunds(t1, t2, userAccount, index, { from: userAccount })

  claimBuyerFunds.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    userAccount: Account,
  ) => dx.claimBuyerFunds.call(t1, t2, userAccount, index)

  const deposit = (tokenAddress: Account, amount: Balance, userAccount: Account) =>
    estimateGas({ cb: dx.deposit, mainParams: [tokenAddress, amount], txParams: { from: userAccount } })
    // dx.deposit(tokenAddress, amount, { from: userAccount })

  const withdraw: DutchExchange['withdraw'] = (tokenAddress: TokenCode, amount: Balance, userAccount: Account) =>
    estimateGas({ cb: dx.withdraw, mainParams: [tokenAddress, amount], txParams: { from: userAccount } })
    // dx.withdraw(tokenAddress, amount, { from: userAccount })

  withdraw.sendTransaction = (tokenAddress: TokenCode, amount: Balance, userAccount: Account) =>
    estimateGas({ cb: dx.withdraw, mainParams: [tokenAddress, amount], txParams: { from: userAccount } }, 'sendTransaction')
    // dx.withdraw.sendTransaction(tokenAddress, amount, { from: userAccount })

  const depositAndSell: DutchExchange['depositAndSell'] = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    userAccount: Account,
  ) => estimateGas({ cb: dx.depositAndSell, mainParams: [t1, t2, amount], txParams: { from: userAccount } }, 'sendTransaction')
  // dx.depositAndSell(t1, t2, amount, { from: userAccount, gasPrice: GAS_PRICE, gas: GAS_LIMIT_TESTING })

  depositAndSell.call = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    userAccount: Account,
  ) => dx.depositAndSell.call(t1, t2, amount, { from: userAccount })

  depositAndSell.sendTransaction = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    amount: Balance,
    userAccount: Account,
  ) => estimateGas({ cb: dx.depositAndSell, mainParams: [t1, t2, amount], txParams: { from: userAccount } }, 'sendTransaction')

  // TODO: could be an issue
  const claimAndWithdraw = (
    { sell: { address: t1 }, buy: { address: t2 } }: TokenPair,
    index: Index,
    amount: Balance,
    userAccount: Account,
    ) => estimateGas({ cb: dx.claimAndWithdraw, mainParams: [t1, t2, userAccount, index, amount], txParams: { from: userAccount } })
    // dx.claimAndWithdraw(t1, t2, userAccount, index, amount, { from: userAccount, gas: 4712388 })

  const isTokenApproved = (tokenAddress: Account) => dx.approvedTokens.call(tokenAddress)

  const getApprovedAddressesOfList = (tokenAddresses: Account[]) => dx.getApprovedAddressesOfList.call(tokenAddresses)

  const getDXTokenBalance = (tokenAddress: Account, userAccount: Account) =>
    dx.balances.call(tokenAddress, userAccount)

  const getRunningTokenPairs = (tokenList: Account[]) => dxHelper.getRunningTokenPairs.call(tokenList)

  const getSellerBalancesOfCurrentAuctions = (
    sellTokenArr: Account[],
    buyTokenArr: Account[],
    userAccount: Account,
  ) => dxHelper.getSellerBalancesOfCurrentAuctions.call(sellTokenArr, buyTokenArr, userAccount)

  const getIndicesWithClaimableTokensForSellers = (
    { sell: { address: sellToken }, buy: { address: buyToken } }: TokenPair,
    userAccount: Account,
    lastNAuctions: number = 0,
  ) => dxHelper.getIndicesWithClaimableTokensForSellers.call(sellToken, buyToken, userAccount, lastNAuctions)

  const getFeeRatio = (userAccount: Account) => dx.getFeeRatio.call(userAccount)

  const ethToken = () => dx.ethToken.call()

  const getPriceOfTokenInLastAuction = (tokenAddress: Account) => dx.getPriceOfTokenInLastAuction.call(tokenAddress)

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
    ethToken,
    isTokenApproved,
    getApprovedAddressesOfList,
    getDXTokenBalance,
    getLatestAuctionIndex,
    getAuctionStart,
    getClosingPrice,
    getLastAuctionPrice,
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
    claimAndWithdrawTokensFromSeveralAuctionsAsSeller,
    getFeeRatio,
    postSellOrder,
    postBuyOrder,
    claimSellerFunds,
    claimBuyerFunds,
    deposit,
    withdraw,
    depositAndSell,
    claimAndWithdraw,
    getPriceOfTokenInLastAuction,
    event,
    allEvents,
  }
}
