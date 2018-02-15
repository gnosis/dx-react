import { promisedWeb3 } from './web3Provider'
import { promisedTokens } from './Tokens'
import { promisedDutchX } from './DutchX'

import { TokenCode, TokenPair, Account, Balance } from 'types'
import { dxAPI, Index } from './types'
import { BigNumber } from 'bignumber.js'

const promisedAPI = initAPI()

export const getCurrentAccount = async () => {
  const { web3 } = await promisedAPI

  return web3.getCurrentAccount()
}

const fillDefaultAccount = (account?: Account) => !account ? getCurrentAccount() : account

export const getAllAccounts = async () => {
  const { web3 } = await promisedAPI

  return web3.getAccounts()
}

// ether balance, not ETH tokens
export const getETHBalance = async (account?: Account) => {
  const { web3 } = await promisedAPI
  if (!account) account = await web3.getCurrentAccount()

  return web3.getETHBalance(account)
}

// ETH token balance
export const getCurrentBalance = async (tokenName: TokenCode = 'ETH', account?: Account) => {
  account = await fillDefaultAccount(account)
  
  if (tokenName && tokenName === 'ETH') {
    const { getETHBalance } = await promisedWeb3

    return getETHBalance(account)
  }

  const { Tokens } = await promisedAPI
  // account would normally be taken from redux state and passed inside an action
  // but just in case

  // should probably change name here to WETH
  return Tokens.getTokenBalance(tokenName, account)
}

export const getTokenBalance = async (code: TokenCode, account?: Account) => {
  account = await fillDefaultAccount(account)
  if (code === 'ETH') {
    const { getETHBalance } = await promisedWeb3

    return getETHBalance(account)
  }
  
  const { Tokens } = await promisedAPI
  // account would normally be taken from redux state and passed inside an action
  // but just in case

  return Tokens.getTokenBalance(code, account)
}

// TODO: remove ['ETH', 'GNO'] default, use actions for this
export const getTokenBalances = async (tokenList: TokenCode[] = ['ETH', 'GNO'], account?: Account) => {
  account = await fillDefaultAccount(account)

  const balances = await Promise.all(tokenList.map(code => getTokenBalance(code, account)))

  // [{name: 'ETH': balance: Balance}, {...}]
  return tokenList.map((code, i) => ({
    name: code,
    balance: balances[i] as BigNumber,
  }))
}

export const getLatestAuctionIndex = async (pair: TokenPair) => {
  const { DutchX } = await promisedAPI

  return DutchX.getLatestAuctionIndex(pair)
}

/*
 * closingPrice - get's closingPrice of Auction
 * @param sellToken 
 * @param buyToken 
 * @param aDiff - Number to offset auctionIndex by - if left blank defaults to lastAuction (-1)
 * @returns [BigNumber(num), BigNumber(den)]
 */
// TODO: pass in the whole TokenPair from the action
export const closingPrice = async (sell: TokenCode, buy: TokenCode, aDiff: number = -1) => {
  const { DutchX } = await promisedAPI
  const pair = { sell, buy }

  const currentAuctionIdx = await DutchX.getLatestAuctionIndex(pair)

  const auctionIdx = currentAuctionIdx.add(aDiff)
  // Guard against negative index
  if (auctionIdx.lessThan(0) || auctionIdx.eq(currentAuctionIdx)) {
    return Promise.reject(`Invalid auction index ${auctionIdx}. Auction index must be >= 0 and < ${currentAuctionIdx}`)
  }

  return DutchX.getClosingPrice(pair, auctionIdx)
}

// TODO: pass in the whole TokenPair from the action
export const postSellOrder = async (
  sell: TokenCode,
  buy: TokenCode,
  amount: Balance,
  index: Index,
  account?: Account,
) => {
  const { Tokens, DutchX } = await promisedAPI
  const pair = { sell, buy }

  account = await fillDefaultAccount(account)

  // TODO: in future ask for a larger allowance
  const receipt = await Tokens.approve(sell, DutchX.address, amount, { from: account })
  console.log('approved tx', receipt)

  return DutchX.postSellOrder(pair, amount, index, account)
}

export const postSellOrder.call = async (
  sell: TokenCode,
  buy: TokenCode,
  amount: Balance,
  index: Index,
  account?: Account,
) => {
  const { Tokens, DutchX } = await promisedAPI
  const pair = { sell, buy }

  account = await fillDefaultAccount(account)

  // TODO: in future ask for a larger allowance
  const receipt = await Tokens.approve(sell, DutchX.address, amount, { from: account })
  console.log('approved tx', receipt)

  return DutchX.postSellOrder.call(pair, amount, index, account)
}

/*
 * get seller balance from auction corresponding to a pair of tokens at an index
 * @param pair TokenPair
 * @param index auctionIndex, current auction by default
 * @param account userccount, current web3 account by default
 */
export const getSellerBalance = async (pair: TokenPair, index?: Index, account?: Account) => {
  const { DutchX } = await promisedAPI
  account = await fillDefaultAccount(account)

  return DutchX.getSellerBalances(pair, index, account)
}

/*
 * claim seller funds from auction corresponding to a pair of tokens at an index
 * @param pair TokenPair
 * @param index auctionIndex, current auction by default
 * @param account userccount, current web3 account by default
 */
export const claimSellerFunds = async (pair: TokenPair, index?: Index, account?: Account) => {
  const { DutchX } = await promisedAPI

  return DutchX.claimSellerFunds(pair, index, account)
}

/*
 * get amount of funds already claimed for auction corresponding to a pair of tokens at an index
 * @param pair TokenPair
 * @param index auctionIndex, current auction by default
 * @param account userccount, current web3 account by default
 */
export const getClaimedAmounts = async (pair: TokenPair, index?: Index, account?: Account) => {
  const { DutchX } = await promisedAPI

  return DutchX.getClaimedAmounts(pair, index, account)
}

/*
 * deposit amount of a tokens for the DutchExchange auction to hold in the account's name
 * @param pair TokenPair
 * @param index auctionIndex, current auction by default
 * @param account userccount, current web3 account by default
 */
export const deposit = async (code: TokenCode, amount: Balance, account?: Account) => {
  const { DutchX } = await promisedAPI

  return DutchX.deposit(code, amount, account)
}

/*
 * withdraw tokens that the DutchExchange auction is holding in the account's name
 * @param pair TokenPair
 * @param index auctionIndex, current auction by default
 * @param account userccount, current web3 account by default
 */
export const withdraw = async (code: TokenCode, amount: Balance, account?: Account) => {
  const { DutchX } = await promisedAPI

  return DutchX.withdraw(code, amount, account)
}


async function initAPI(): Promise<dxAPI> {
  const [web3, Tokens, DutchX] = await Promise.all([
    promisedWeb3,
    promisedTokens,
    promisedDutchX,
  ])

  return { web3, Tokens, DutchX }
}
