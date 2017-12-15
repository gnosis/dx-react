import dutchX from './initialization'

// import { weiToEth } from 'utils/helpers'
import { Account, Balance, TokenCode } from 'types'

let dxInst: any

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchXConnection = async (DUTCHX_OPTIONS: any) => {
  console.log(' ===> FIRING initDutchX ACTION')
  try {
    return dxInst = await dutchX.init(DUTCHX_OPTIONS)
  } catch (e) {
    console.log('initDutchXConnection [api/dutchX.ts] ERROR: ', e.message)
    throw (e)
  }
}

/**
 * Returns an instance of the connection to DutchX
 */
export const getDutchXConnection = () => dxInst

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const dx = getDutchXConnection()

  return await new Promise((resolve, reject) => dx.web3.eth.getAccounts(
    (e: Object, accounts: Object) => (e ? reject(e) : resolve(accounts[0]))),
  )
}

export const getAllAccounts = async () => {
  const dx = getDutchXConnection()

  const accounts = await new Promise((resolve, reject) => dx.web3.eth.getAccounts((err: any, accts: any) => {
    err ? reject(err) : resolve(accts)
  }))
  console.log(accounts)
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account: Account) => {
  const dx = getDutchXConnection()

  return (await dx.TokenETH.balanceOf(account)).toNumber()
}

// TODO: probably extrapolate some parameterizable parts - ContractName in string form for example
export const getTokenBalances = async (account: Account) => {
  const dx = getDutchXConnection()

  const ETH = {
    name: 'ETH',
    balance: (await dx.TokenETH.balanceOf(account)).toNumber(),
  }
  const GNO = {
    name: 'GNO',
    balance: (await dx.TokenGNO.balanceOf(account)).toNumber(),
  }

  return [ETH, GNO]
}

/**
 * closingPrice - get's closingPrice of Auction
 * @param sellToken 
 * @param buyToken 
 * @param aDiff - Number to offset auctionIndex by - if left blank defaults to lastAuction (-1)
 */
export const closingPrice = async (sellToken: TokenCode, buyToken: TokenCode, aDiff: number = 1) => {
  const DX = getDutchXConnection()
  const exchange = DX[`DutchExchange${sellToken}${buyToken}`]

  if (!exchange) {
    console.warn(`Exchange ${sellToken}/${buyToken} has not yet started`)
    return 'N/A'
  }

  const currAuctionIdx = (await exchange.auctionIndex()).toNumber()
    // Guard against negative index
  if (currAuctionIdx - aDiff < 0) {
    console.warn('WARNING: Attempting to access a negative indexed Auction - reverting to current Auction price.')
    aDiff = 0
  }

  const [num, den] = await exchange.closingPrices(currAuctionIdx - aDiff)

  console.log(`currAuctionIdx = ${currAuctionIdx} // lastClosingPrice: 1 ${sellToken} buys ${num / den} ${buyToken}`)
  return (num / den)
}

export const approveToken = async (account: Account, amount: Balance, sell: TokenCode, buy: TokenCode) => {
  const dx = getDutchXConnection()

  const exchange = dx[`DutchExchange${sell}${buy}`]
  if (!exchange) return Promise.reject(`No DutchExchange contract available for ${sell} -> ${buy} pair`)

  const token = dx[`Token${sell}`]
  if (!token) return Promise.reject(`No contract available for ${sell} token`)

  return token.approve(exchange.address, amount, { from: account })
}

export const postSellOrder = async (account: Account, amount: Balance, sell: TokenCode, buy: TokenCode) => {
  const dx = getDutchXConnection()

  const exchange = dx[`DutchExchange${sell}${buy}`]
  if (!exchange) return Promise.reject(`No DutchExchange contract available for ${sell} -> ${buy} pair`)

    // const token = dx[`Token${sell}`]
    // if (!token) return Promise.reject(`No contract available for ${sell} token`)
    
    // TODO: in future ask for a larger allowance
    // const tokenApprovalReceipt = await token.approve(exchange.address, amount, { from: account })
    // console.log('approved tx', tokenApprovalReceipt)

  return exchange.postSellOrder(amount, { from: account })
}
