import { promisedWeb3 } from './web3Provider'
import { promisedTokens } from './Tokens'
import { promisedDutchX } from './DutchX'

import { TokenCode, Account, Balance } from 'types'
import { dxAPI } from './types'

const promisedAPI = initAPI()

export const getCurrentAccount = async () => {
  const { web3 } = await promisedAPI

  return web3.getCurrentAccount()
}

export const getAllAccounts = async () => {
  const { web3 } = await promisedAPI

  return web3.getAccounts()
}

// ether balance, not ETH tokens
export const getETHBalance = async () => {
  const { web3 } = await promisedAPI

  return web3.getETHBalance()
}

// ETH token balance
export const getCurrentBalance = async (account?: Account) => {
  const { Tokens, web3 } = await promisedAPI

  // account would normally be taken from redux state and passed inside an action
  // but just in case
  if (!account) account = await web3.getCurrentAccount()

  return Tokens.getTokenBalance('ETH', account)
}

// TODO: remove ['ETH', 'GNO'] default, use actions for this
export const getTokenBalances = async (tokenList: TokenCode[] = ['ETH', 'GNO'], account?: Account) => {
  const { Tokens, web3 } = await promisedAPI

  if (!account) account = await web3.getCurrentAccount()

  const balances = Promise.all(tokenList.map(code => Tokens.getTokenBalance(code, account)))

  // [{name: 'ETH': balance: Balance}, {...}]
  return tokenList.map((code, i) => ({
    name: code,
    balance: balances[i],
  }))
}


/*
 * closingPrice - get's closingPrice of Auction
 * @param sellToken 
 * @param buyToken 
 * @param aDiff - Number to offset auctionIndex by - if left blank defaults to lastAuction (-1)
 */
// TODO: pass in the whole TokenPair from the action
export const closingPrice = async (sell: TokenCode, buy: TokenCode, aDiff: number = -1) => {
  const { DutchX } = await promisedAPI
  const pair = { sell, buy }

  const currentAuctionIdx = await DutchX.getAuctionIndex(pair)

  const auctionIdx = currentAuctionIdx - aDiff
  // Guard against negative index
  if (auctionIdx < 0 || auctionIdx === currentAuctionIdx) {
    return Promise.reject(`Invalid auction index ${auctionIdx}. Auction index must be >= 0 and < ${currentAuctionIdx}`)
  }

  return DutchX.getClosingPrice(pair, auctionIdx)
}

// TODO: pass in the whole TokenPair from the action
export const postSellOrder = async (account: Account, amount: Balance, sell: TokenCode, buy: TokenCode) => {
  const { Tokens, DutchX } = await promisedAPI

  const pair = { sell, buy }

  // TODO: in future ask for a larger allowance
  const receipt = await Tokens.approve(sell, DutchX.getAddress(pair), amount, { from: account })
  console.log('approved tx', receipt)

  return DutchX.postSellOrder(pair, amount, account)
}


async function initAPI(): Promise<dxAPI> {
  const [web3, Tokens, DutchX] = await Promise.all([
    promisedWeb3,
    promisedTokens,
    promisedDutchX,
  ])

  return { web3, Tokens, DutchX }
}
