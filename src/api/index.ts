import { promisedWeb3 } from './web3Provider'
import { promisedTokens } from './Tokens'
import { promisedDutchX } from './dutchx'

import { TokenCode, TokenPair, Account, Balance, BigNumber } from 'types'
import { dxAPI, Index, DefaultTokenList } from './types'

const promisedAPI = (window as any).AP = initAPI()

export const toWei = async (amt: string | number | BigNumber): Promise<BigNumber> => {
  const { web3: { web3 } } = await promisedAPI

  return web3.toBigNumber(web3.toWei(amt))
}

export const toEth = async (amt: number | string | BigNumber): Promise<string> => {
  const { web3: { web3 } } = await promisedAPI

  return web3.toBigNumber(web3.fromWei(amt))
}

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
export const getETHBalance = async (account?: Account, inETH?: boolean) => {
  const { web3 } = await promisedAPI
  account = await web3.getCurrentAccount()

  return web3.getETHBalance(account, inETH)
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

export const getEtherTokenBalance = async (token: TokenCode, account?: Account) => {
  if (token !== 'ETH') return
  const { Tokens } = await promisedAPI
  account = await fillDefaultAccount(account)

  return Tokens.getTokenBalance('ETH', account)
}

export const getTokenAllowance = async (token: TokenCode, account?: Account) => {
  const { DutchX, Tokens } = await promisedAPI
  account = await fillDefaultAccount(account)

  return Tokens.allowance(token, account, DutchX.address)
}

export const tokenApproval = async (token: TokenCode, amount: Balance, account?: Account) => {
  const { DutchX, Tokens } = await promisedAPI
  account = await fillDefaultAccount(account)

  return Tokens.approve(token, DutchX.address, amount, { from: account })
}

export const tokenSupply = async (code: TokenCode) => {
  const { Tokens } = await promisedAPI

  return Tokens.getTotalSupply(code)
}

export const depositETH = async (amount: Balance, account?: Account) => {
  const { Tokens } = await promisedAPI
  account = await fillDefaultAccount(account)

  return Tokens.depositETH({ from: account, value: amount })
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

export const getClosingPrice = async (pair: TokenPair, auctionIndex?: Index) => {
  const { DutchX } = await promisedAPI

  if (auctionIndex === undefined) auctionIndex = await DutchX.getLatestAuctionIndex(pair)

  return DutchX.getClosingPrice(pair, auctionIndex)
}

export const getPrice = async (pair: TokenPair, auctionIndex?: Index) => {
  const { DutchX } = await promisedAPI

  if (auctionIndex === undefined) auctionIndex = await DutchX.getLatestAuctionIndex(pair)

  return DutchX.getPrice(pair, auctionIndex)
}

export const getAuctionStart = async (pair: TokenPair) => {
  const { DutchX } = await promisedAPI

  return DutchX.getAuctionStart(pair)
}

export const getTime = async () => {
  const { web3 } = await promisedAPI

  return web3.getTimestamp()
}

export const approveAndPostSellOrder = async (
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

// TODO: pass in the whole TokenPair from the action
export const postSellOrder = async (
  sell: TokenCode,
  buy: TokenCode,
  amount: Balance,
  index: Index,
  account?: Account,
) => {
  const { DutchX } = await promisedAPI
  const pair = { sell, buy }
  account = await fillDefaultAccount(account)

  return DutchX.postSellOrder(pair, amount, index, account)
}

postSellOrder.call = async (
  sell: TokenCode,
  buy: TokenCode,
  amount: Balance,
  index: Index,
  account?: Account,
) => {
  const { DutchX } = await promisedAPI
  const pair = { sell, buy }
  account = await fillDefaultAccount(account)

  return DutchX.postSellOrder.call(pair, amount, index, account)
}

export const depositAndSell = async (
  sell: TokenCode,
  buy: TokenCode,
  amount: Balance,
  account?: Account,
) => {
  const { DutchX } = await promisedAPI
  const pair = { sell, buy }
  account = await fillDefaultAccount(account)

  return DutchX.depositAndSell(pair, amount, account)
}

depositAndSell.call = async (
  sell: TokenCode,
  buy: TokenCode,
  amount: Balance,
  account?: Account,
) => {
  const { DutchX } = await promisedAPI
  const pair = { sell, buy }
  account = await fillDefaultAccount(account)

  return DutchX.depositAndSell.call(pair, amount, account)
}

export const getDXTokenBalance = async (token: TokenCode, account: Account) => {
  const { DutchX } = await promisedAPI
  account = await fillDefaultAccount(account)

  return DutchX.getBalance(token, account)
}

/*
 * get seller balance from auction corresponding to a pair of tokens at an index
 * @param pair TokenPair
 * @param index auctionIndex, current auction by default
 * @param account userccount, current web3 account by default
 */
export const getSellerBalance = async (pair: TokenPair, index?: Index, account?: Account) => {
  const { DutchX } = await promisedAPI;

  [index, account] = await Promise.all<Index, Account>([
    index === undefined ? DutchX.getLatestAuctionIndex(pair) : index,
    fillDefaultAccount(account),
  ])

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

export const getUnclaimedSellerFunds = async (pair: TokenPair, index?: Index, account?: Account) => {
  const { DutchX, web3: { web3 } } = await promisedAPI;

  [index, account] = await Promise.all<Index, Account>([
    index === undefined ? DutchX.getLatestAuctionIndex(pair) : index,
    fillDefaultAccount(account),
  ])

  try {
    const [claimable] = await DutchX.claimSellerFunds.call(pair, index, account)
    return claimable as BigNumber
  } catch (e) {
    console.log('Nothing to claim')
    return web3.toBigNumber(0) as BigNumber
  }
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

/**
 * getFeeRatio - returns decimal - must be converted to Percent
 * @param account - Account
 */
export const getFeeRatio = async (account: Account) => {
  const { DutchX } = await promisedAPI
  account = await fillDefaultAccount(account)

  const [num, den] = await DutchX.getFeeRatio(account)
  return num.div(den)
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

deposit.call = async (code: TokenCode, amount: Balance, account?: Account) => {
  const { DutchX } = await promisedAPI

  return DutchX.deposit.call(code, amount, account)
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

/**
* getSellerOngoingAuctions
* @param tokensJSON
* @param account
*/
export const getSellerOngoingAuctions = async (tokensJSON: DefaultTokenList, account: Account): Promise<any[]> => {
  const { DutchX } = await promisedAPI
  // assuming tokensJSON comes in form:
  // defaultToken = { name: 'Ether Token', address: '0xAg9823nfejcdksak1o38fFa09384', imgBytes: [ ... ] }
  const tokensJSONAddresses = tokensJSON.map((t: any) => t.address)
  const runningPairsArr = await DutchX.getRunningTokenPairs(tokensJSONAddresses)

  // get Array back of Auctions user is in
  // grab sellerBalance of USER for each current ongoing auction
  // @ts-ignore
  const sellerOngoingAuctions: any[] = (await DutchX.getSellerBalancesOfCurrentAuctions(...runningPairsArr, account)).map((res: any) => res.toNumber())
  // we know user is participating in (runningPairsArr[0][0]-runningPairsArr[1][0] && runningPairsArr[0][3]-runningPairsArr[1][3])

  const ongoingAuctions = tokensJSON.reduce((accum, _, index, origArr) => {
    if (!sellerOngoingAuctions[index]) return accum

    // pair = [ '0x68hFkjhsfF78', '0xLKJ89873FFF' ]
    const pair = [runningPairsArr[0][index], runningPairsArr[1][index]]

    let sell = {}, buy = {}

    // for each pair, check against tokenList for address
    pair.forEach((p, index) => {
      origArr.forEach((token: any) => {
        // match pair[0] or pair[1] with token.address ELSE return
        if (token.address !== p) return
        if (index === 0) return sell = { name: token.name, address: p }
        return buy = { name: token.name, address: p }
      })
    })

    return [...accum, { sell, buy }]
  }, [])

  // Checks ongoingAuctions Array if each ongoingAuction has claimable Tokens
  // Array indices are lined up
  // @returns => forEach ongoingAuction => (indices[], userBalanceInSpecificAuction[]) => e.g for: ETH/GNO => (indices[], userBalance[])
  const claimableTokens = await Promise.all(ongoingAuctions.map(auction => DutchX.getIndicesWithClaimableTokensForSellers(auction.sell.address, auction.buy.address, account, 0)))
  /* console.log(claimableTokens)
  console.log(`
    claimableTokens = ${claimableTokens}
    specific arr    = ${claimableTokens[0][0]}
    length          = ${claimableTokens[0][0].length}
  `) */

  // consider adding LAST userBalance from claimableTokens to ongoingAuctions object as COMMITTED prop
  const auctionsArray = ongoingAuctions.map((auction, index) => {
    return {
      ...auction,
      indices: claimableTokens[index][0],
      balancePerIndex: claimableTokens[index][1],
      claim: claimableTokens[index][0].length >= 2,
    }
  })

  return auctionsArray
}

async function initAPI(): Promise<dxAPI> {
  const [web3, Tokens, DutchX] = await Promise.all([
    promisedWeb3,
    promisedTokens,
    promisedDutchX,
  ])
  console.log('INDEX API => ', { web3, Tokens, DutchX })
  return { web3, Tokens, DutchX }
}
