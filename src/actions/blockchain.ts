import { push } from 'connected-react-router'
import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'

import {
  closingPrice,
  depositAndSell,
  depositETH,
  getCurrentAccount,
  getDXTokenBalance,
  getEtherTokenBalance,
  getFeeRatio,
  getSellerOngoingAuctions,
  getTokenAllowance,
  getTokenBalances,
  postSellOrder,
  tokenApproval,
  toWei,
  getETHBalance,
} from 'api'

// TODO: remove
import defaultTokensTesting from 'api/apiTesting'

import {
  openModal,
  closeModal,
  setTokenBalance,
  setSellTokenAmount,
  setClosingPrice,
  setOngoingAuctions,
} from 'actions'


import { findDefaultProvider } from 'selectors/blockchain'

import { timeoutCondition } from '../utils/helpers'

import { BigNumber, TokenBalances, Account, Balance, State, TokenCode } from 'types'

export enum TypeKeys {
  SET_GNOSIS_CONNECTION = 'SET_GNOSIS_CONNECTION',
  SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS',
  SET_ACTIVE_PROVIDER = 'SET_ACTIVE_PROVIDER',
  SET_GAS_COST = 'SET_GAS_COST',
  SET_GAS_PRICE = 'SET_GAS_PRICE',
  REGISTER_PROVIDER = 'REGISTER_PROVIDER',
  UPDATE_PROVIDER = 'UPDATE_PROVIDER',
  SET_ETHER_TOKENS = 'SET_ETHER_TOKENS',
  OTHER_ACTIONS = 'OTHER_ACTIONS',
}


// TODO define reducer for GnosisStatus
export const setDutchXInitialized = createAction<{ initialized?: boolean, error?: any }>('SET_DUTCHX_CONNECTION')
export const setConnectionStatus = createAction<{ connected?: boolean }>('SET_CONNECTION_STATUS')
export const setActiveProvider = createAction<{ provider?: string }>('SET_ACTIVE_PROVIDER')
export const registerProvider = createAction<{ provider?: string, data?: Object }>('REGISTER_PROVIDER')
export const updateProvider = createAction<{ provider?: string, data?: Object }>('UPDATE_PROVIDER')
export const setCurrentBalance = createAction<{ provider?: string, currentBalance?: Balance | BigNumber }>('SET_CURRENT_BALANCE')
export const setCurrentAccountAddress =
  createAction<{ provider?: string, currentAccount?: Object }>('SET_CURRENT_ACCOUNT_ADDRESS')
export const fetchTokens = createAction<{ tokens?: TokenBalances }>('FETCH_TOKENS')

export const setFeeRatio = createAction<{ feeRatio: number }>('SET_FEE_RATIO')
export const setTokenSupply = createAction<{ mgnSupply: string | BigNumber }>('SET_TOKEN_SUPPLY')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 200000

export const updateMainAppState = () => async (dispatch: Function) => {
  const currentAccount = await getCurrentAccount()
  const { elements: defObj } = await defaultTokensTesting()

  const tokenNameList = defObj.map(t => t.symbol)
  // Check state in parallel
  /*
    * Provider?
    * Account?
    * Balance (ETH)?
    * TokenBalances
    * OngoingAuctions
    * MGN fee ratio
    * localStorage changes
   */
  const [ongoingAuctions, tokenBalances, feeRatio] = await Promise.all([
    getSellerOngoingAuctions(defObj, currentAccount),
    calcAllTokenBalances(tokenNameList as TokenCode[]),
    getFeeRatio(currentAccount),
  ])

  const mgn = tokenBalances.find(t => t.name === 'MGN')

  // dispatch Actions
  dispatch(batchActions([
    ...tokenBalances.map((token: { name: string, balance: string }) =>
    setTokenBalance({ tokenName: token.name, balance: token.balance })),
    setOngoingAuctions({ ongoingAuctions }),
    setFeeRatio({ feeRatio: feeRatio.toNumber() }),
    setTokenSupply({ mgnSupply: mgn.balance }),
  ]))
}

// CONSIDER: moving this OUT of blockchain into index or some INITIALIZATION action module.
/**
 * (Re)-Initializes DutchX connection according to current providers settings
 */
export const initDutchX = () => async (dispatch: Function, getState: any) => {
  // initialize
  try {
    const state = getState()

    // determine new provider
    const newProvider: any = findDefaultProvider(state)
    if (newProvider) {
      dispatch(setActiveProvider(newProvider.name))
      dispatch(setDutchXInitialized({ initialized: true }))
    }
  } catch (error) {
    console.warn(`DutchX initialization Error: ${error}`)
    return dispatch(setDutchXInitialized({ error, initialized: false }))
  }

  // connect
  try {
    let account: Account
    let currentBalance: Balance | BigNumber
    let tokenBalances: { name: TokenCode, balance: Balance }[]

    // runs test executions on gnosisjs
    const getConnection = async () => {
      try {
        account = await getCurrentAccount()
        currentBalance = (await getETHBalance(account, true)).toString()
        // TODO: pass a list of tokens from state or globals, for now ['ETH', 'GNO'] is default
        tokenBalances = await calcAllTokenBalances()
        return dispatch(getClosingPrice())
      } catch (e) {
        console.log(e)
      }

    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])

    dispatch(setCurrentAccountAddress({ currentAccount: account }))
    dispatch(setCurrentBalance({ currentBalance }))

    // Grab each TokenBalance and dispatch
    dispatch(batchActions(tokenBalances.map((token: { name: string, balance: string }) =>
      setTokenBalance({ tokenName: token.name, balance: token.balance }))))

    return dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    console.warn(`DutchX connection Error: ${error}`)
    return dispatch(setConnectionStatus({ connected: false }))
  }
}

export const getClosingPrice = () => async (dispatch: Function, getState: any) => {
  const { tokenPair: { buy, sell } } = getState()

  try {
    const lastPrice = (await closingPrice(sell, buy)).toString()
    return dispatch(setClosingPrice({ sell, buy, price: lastPrice }))
  } catch (e) {
    console.log(e)
  }
}

/**
 * checkUserStateAndSell()(dispatch, state) => THUNK Action
 *
*/
export const checkUserStateAndSell = () => async (dispatch: Function, getState: Function) => {
  const {
    tokenPair: { sell, sellAmount },
    blockchain: { activeProvider, currentAccount },
  } = getState()
  const weiSellAmt = await toWei(sellAmount)

  try {
    // change to modal with button, new modal
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Contacting Ethereum blockchain`,
        body: `Please wait`,
      },
    }))
    // check ETHER deposit && start fetching allowance amount in ||
    const promisedTokenAllowance = checkTokenAllowance(sell, weiSellAmt, currentAccount)
    const wrappedETH = await checkEthTokenBalance(sell, weiSellAmt, currentAccount)
    // if SELLTOKEN !== ETH, returns undefined and skips
    if (wrappedETH) {
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Wrapping ${sell.toUpperCase()}`,
          // tslint:disable-next-line
          body: `Confirmation: ${sell.toUpperCase()} is not an ERC20 Token and must be wrapped - please check ${activeProvider}`,
        },
      }))
      // TODO only deposit difference
      await depositETH(wrappedETH.toString(), currentAccount)
    }
    // Check allowance amount for SELLTOKEN
    // if allowance is ok, skip
    const tokenAllowance = await promisedTokenAllowance
    if (tokenAllowance) {
      dispatch(openModal({
        modalName: 'ApprovalModal',
        modalProps: {
          header: `Confirm ${sell.toUpperCase()} Token movement`,
          // tslint:disable-next-line
          body: `Confirmation: DutchX needs your permission to move your ${sell.toUpperCase()} Tokens for this Auction - please check ${activeProvider}`,
        },
      }))
    // Go straight to sell order if deposit && allowance both good
    } else {
      dispatch(submitSellOrder())
    }
  } catch (e) {
    dispatch(errorHandling(e))
  }
}

export const submitSellOrder = () => async (dispatch: any, getState: any) => {
  const {
    tokenPair: { sell, buy, sellAmount, index = 0 },
    blockchain: { activeProvider, currentAccount },
  } = getState()
  const weiSellAmt = await toWei(sellAmount)

  try {
    // don't do anything when submitting a <= 0 amount
    // indicate that nothing happened with false return
    if (sellAmount <= 0) throw new Error('Invalid selling amount. Cannot sell 0.')

    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Confirm sell of ${sellAmount} ${sell.toUpperCase()} tokens`,
        body: `Final confirmation: please accept/reject ${sell.toUpperCase()} sell order via ${activeProvider}`,
      },
    }))

    // NOTE: switching to depositAndSell for now, seems more intuitive
    // check current DX balance && take difference via BigNumber
    const userDXBalance = await getDXTokenBalance(sell, currentAccount)
    console.log('userDXBalance = ', userDXBalance)

    // if user's sellAmt > DX.balance(token)
    // deposit(sellAmt) && postSellOrder(sellAmt)
    let receipt
    if (weiSellAmt.greaterThan(userDXBalance)) {
      // TODO: discuss this with Dmitry and Alex
      // const calcedSellAmt = (weiSellAmt.plus(userDXBalance)).toString()
      receipt = await depositAndSell(sell, buy, weiSellAmt.toString(), currentAccount)
      console.log('depositAndSell receipt', receipt)

    // else User has enough balance on DX for Token and can sell w/o deposit
    } else {
      receipt = await postSellOrder(sell, buy, weiSellAmt.toString(), index, currentAccount)
      console.log('postSellOrder receipt', receipt)
    }
    const { args: { auctionIndex } } = receipt.logs.find(log => log.event === 'NewSellOrder')
    console.log(`sell order went to ${sell}-${buy}-${auctionIndex.toString()}`)
    dispatch(closeModal()) 

    // TODO: pass a list of tokens from state or globals, for now ['ETH', 'GNO'] is default
    const tokenBalances = await getTokenBalances(undefined, currentAccount)
    const { name, balance } = tokenBalances.find(({ name }) => name === sell)

    // new balance for the token just sold
    dispatch(setTokenBalance({ tokenName: name, balance: balance.div(10 ** 18).toString() }))

    // proceed to /auction/0x03494929349594
    dispatch(push(`auction/${sell}-${buy}-${auctionIndex.toString()}`))

    // reset sellAmount
    dispatch(setSellTokenAmount({ sellAmount: 0 }))

    // indicate that submition worked
    return true
  } catch (error) {
    dispatch(errorHandling(error))
  }
}

// TODO: if add index of current tokenPair to state
export const approveAndPostSellOrder = (choice: string) => async (dispatch: Function, getState: any) => {
  const {
    tokenPair: { sell, sellAmount },
    blockchain: { currentAccount },
  } = getState()
  const weiSellAmt = await toWei(sellAmount)

  try {
    // don't do anything when submitting a <= 0 amount
    // indicate that nothing happened with false return
    if (sellAmount <= 0) throw new Error('Invalid selling amount. Cannot sell 0.')
    // here check if users token Approval amount is high enough and APPROVE else => postSellOrder
    if (choice === 'MIN') {
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Approving minimum token movement: ${sellAmount}`,
          body: `You are approving the minimum amount necessary - DutchX will prompt you again the next time.`,
        },
      }))

      const tokenApprovalReceipt = await tokenApproval(sell, weiSellAmt.toString())
      console.log('Approved token', tokenApprovalReceipt)
    } else {
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Approving maximum token movement`,
          body: `You are approving the maximum amount - you will no longer need to sign 2 transactions.`,
        },
      }))
      // CONSIDER/TODO: move allowanceLeft into state
      const allowanceLeft = (await getTokenAllowance(sell, currentAccount)).toNumber()
      const tokenApprovalReceipt = await tokenApproval(sell, ((2 ** 255) - allowanceLeft).toString())
      console.log('Approved token', tokenApprovalReceipt)
    }

    dispatch(submitSellOrder())
  } catch (error) {
    dispatch(errorHandling(error))
  }
}

/**
 * checkEthTokenBalance > returns false or EtherToken Balance
 * @param token
 * @param weiSellAmount
 * @param account
 * @returns boolean | BigNumber <false, amt>
 */
async function checkEthTokenBalance(
  token: TokenCode,
  weiSellAmount: BigNumber,
  account?: Account,
): Promise<boolean | BigNumber> {
  // BYPASS[return false] => if token is not ETHER
  if (token !== 'ETH') return false
  // CONSIDER/TODO: wrappedETH in state or TokenBalance
  const wrappedETH = await getEtherTokenBalance(token, account)
  // BYPASS[return false] => if wrapped Eth is enough
  if (wrappedETH.gte(weiSellAmount)) return false

  return weiSellAmount.minus(wrappedETH)
}

/**
 * checkTokenAllowance > returns false or Token[name] Allowance
 * @param token
 * @param weiSellAmount
 * @param account
 * @returns boolean | BigNumber <false, amt>
 */
async function checkTokenAllowance(
  token: TokenCode,
  weiSellAmount: BigNumber,
  account?: Account,
): Promise<boolean | BigNumber> {
  // perform checks
  const tokenAllowance = await getTokenAllowance(token, account)
  // return false if wrapped Eth is enough
  if (tokenAllowance.gte(weiSellAmount)) return false

  return tokenAllowance
}

function errorHandling(error: Error) {
  return async (dispatch: Function, getState: Function) => {
    const { blockchain: { activeProvider } } = getState()
    const normError = error.message
    console.error('An error has occurred: ', normError)
    // close to unmount
    dispatch(closeModal())

    // go home stacy
    dispatch(push('/'))

    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `TRANSACTION FAILED/CANCELLED`,
        body: `${activeProvider || 'Your provider'} has stopped your transaction. Please see below or console for more info:`,
        button: true,
        error: normError,
      },
    }))
  }
}

// @ts-ignore
async function simulateTX(txFn: Function, txProps: Partial<State>[]) {
  // Simulate Sell order before real transaction
  try {
    console.log(txFn)
    const simResp = await txFn(...txProps)
    console.log('simResp == ', simResp)
  } catch (e) {
    // TODO: fire action blocking button
    console.error('TX Simulation failed => ', e)
    return
  }
}

async function calcAllTokenBalances(tokens?: TokenCode[]) {
  // TODO: pass a list of tokens from state or globals, for now ['ETH', 'GNO'] is default
  const tokenBalances = (await getTokenBalances(tokens))
    .map(({ name, balance }) => ({
      name,
      balance: balance.div(10 ** 18).toString(),
    }))

  return tokenBalances
}
