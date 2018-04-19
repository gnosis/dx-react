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
  getTokenBalance,
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

import { BigNumber, TokenBalances, Account, Balance, State } from 'types'
import { promisedContractsMap } from 'api/contracts'
import { DefaultTokenObject } from 'api/types'

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
  const [{ TokenMGN }, currentAccount, { elements: defObj }] = await Promise.all([
    promisedContractsMap,
    getCurrentAccount(),
    defaultTokensTesting(),
  ])

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
    calcAllTokenBalances(defObj as DefaultTokenObject[]),
    getFeeRatio(currentAccount),
  ])

  console.log('OGA: ', ongoingAuctions, 'TokBal: ', tokenBalances, 'FeeRatio: ', feeRatio)

  const mgn = tokenBalances.find(t => t.address === TokenMGN.address)

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
  const state = getState()
  // initialize
  try {

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
    let tokenBalances: { name: any, address: string, balance: Balance }[]

    // runs test executions on gnosisjs
    const getConnection = async () => {
      try {
        const tokenAddresses = state.tokenList.combinedTokenList
        account = await getCurrentAccount();
        ([currentBalance, tokenBalances] = await Promise.all([
          getETHBalance(account, true),
          calcAllTokenBalances(tokenAddresses),
        ]))

        return dispatch(getClosingPrice())
      } catch (e) {
        console.error(e)
        throw new Error (e)
      }

    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])

    dispatch(setCurrentAccountAddress({ currentAccount: account }))
    dispatch(setCurrentBalance({ currentBalance: currentBalance.toString() }))

    // Grab each TokenBalance and dispatch
    dispatch(batchActions(tokenBalances.map((token: { name: string, balance: string }) =>
      setTokenBalance({ tokenName: token.name, balance: token.balance }))))

    return dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    console.error(`DutchX connection Error: ${error.message}`)
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
  } = getState(),
    weiSellAmt = await toWei(sellAmount),
  // promised Token Allowance to get back later
    promisedTokenAllowance = checkTokenAllowance(sell.address, weiSellAmt, currentAccount)

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
    const wrappedETH = await checkEthTokenBalance(sell.address, weiSellAmt, currentAccount)
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
  } = getState(),
    sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address,
    buyName = buy.symbol.toUpperCase() || buy.name.toUpperCase() || buy.address,
    promisedAmtAndDXBalance = Promise.all([
    toWei(sellAmount),
    getDXTokenBalance(sell.adddress, currentAccount),
  ])

  try {
    // don't do anything when submitting a <= 0 amount
    // indicate that nothing happened with false return
    if (sellAmount <= 0) throw new Error('Invalid selling amount. Cannot sell 0.')

    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Confirm sell of ${sellName} tokens @ address ${sell.address}`,
        body: `Final confirmation: please accept/reject ${sellName} sell order via ${activeProvider}`,
      },
    }))
    // if user's sellAmt > DX.balance(token)
    // deposit(sellAmt) && postSellOrder(sellAmt)
    let receipt
    const [weiSellAmt, userDXBalance] = await promisedAmtAndDXBalance
    console.log('userDXBalance = ', userDXBalance)
    if (weiSellAmt.greaterThan(userDXBalance)) {
      receipt = await depositAndSell(sell, buy, weiSellAmt.toString(), currentAccount)
      console.log('depositAndSell receipt', receipt)

    // else User has enough balance on DX for Token and can sell w/o deposit
    } else {
      receipt = await postSellOrder(sell, buy, weiSellAmt.toString(), index, currentAccount)
      console.log('postSellOrder receipt', receipt)
    }
    const { args: { auctionIndex } } = receipt.logs.find(log => log.event === 'NewSellOrder')
    console.log(`sell order went to ${sellName}-${buyName}-${auctionIndex.toString()}`)
    dispatch(closeModal())

    // grab balance of sold token after sale
    const balance = await getTokenBalance(sell.address, currentAccount)

    // dispatch Actions
    dispatch(batchActions([
      setTokenBalance({ tokenName: sellName, balance: balance.div(10 ** 18).toString() }),
      push(`auction/${sellName}-${buyName}-${auctionIndex.toString()}`),
      setSellTokenAmount({ sellAmount: 0 }),
    ]))
    // new balance for the token just sold
    /* dispatch(setTokenBalance({ tokenName: sellName, balance: balance.div(10 ** 18).toString() }))
    // proceed to /auction/0x03494929349594
    dispatch(push(`auction/${sellName}-${buyName}-${auctionIndex.toString()}`))
    // reset sellAmount
    dispatch(setSellTokenAmount({ sellAmount: 0 }))*/

    // indicate that submission worked
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

      const tokenApprovalReceipt = await tokenApproval(sell.address, weiSellAmt.toString())
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
      const allowanceLeft = (await getTokenAllowance(sell.address, currentAccount)).toNumber()
      const tokenApprovalReceipt = await tokenApproval(sell.address, ((2 ** 255) - allowanceLeft).toString())
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
  tokenAddress: Account,
  weiSellAmount: BigNumber,
  account?: Account,
): Promise<boolean | BigNumber> {
  const { TokenETH } = await promisedContractsMap
  // BYPASS[return false] => if token is not ETHER
  if (tokenAddress !== TokenETH.address) return false
  // CONSIDER/TODO: wrappedETH in state or TokenBalance
  const wrappedETH = await getEtherTokenBalance(account)
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
  tokenAddress: Account,
  weiSellAmount: BigNumber,
  userAddress?: Account,
): Promise<boolean | BigNumber> {
  // perform checks
  const tokenAllowance = await getTokenAllowance(tokenAddress, userAddress)
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

async function calcAllTokenBalances(tokenList?: DefaultTokenObject[]) {
  const tokenBalances = (await getTokenBalances(tokenList))
    .map(({ name, address, balance }) => ({
      name,
      address,
      balance: balance.div(10 ** 18).toString(),
    }))

  return tokenBalances
}
