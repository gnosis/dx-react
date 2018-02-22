// import { dispatch } from 'redux';
import {
  getCurrentBalance,
  getCurrentAccount,
  // initDutchXConnection,
  getTokenBalances,
  // getLatestAuctionIndex,
  postSellOrder,
  closingPrice,
  tokenApproval,
  checkTokenAllowance,
} from 'api'

import {
  openModal,
  closeModal,
  setTokenBalance,
  setSellTokenAmount,
  setClosingPrice
} from 'actions'

import { timeoutCondition } from '../utils/helpers'
// import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'
import { push } from 'connected-react-router'
import { findDefaultProvider } from 'selectors/blockchain'

import { TokenBalances, Account, Balance, TokenCode } from 'types'

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

interface Error {
  error?: string,
  message?: string,
}

// TODO define reducer for GnosisStatus
export const setDutchXInitialized = createAction<{ initialized?: boolean, error?: any }>('SET_DUTCHX_CONNECTION')
export const setConnectionStatus = createAction<{ connected?: boolean }>('SET_CONNECTION_STATUS')
export const setActiveProvider = createAction<{ provider?: string }>('SET_ACTIVE_PROVIDER')
export const registerProvider = createAction<{ provider?: string, data?: Object }>('REGISTER_PROVIDER')
export const updateProvider = createAction<{ provider?: string, data?: Object }>('UPDATE_PROVIDER')
export const setCurrentBalance = createAction<{ provider?: string, currentBalance?: Balance }>('SET_CURRENT_BALANCE')
export const setCurrentAccountAddress =
  createAction<{ provider?: string, currentAccount?: Object }>('SET_CURRENT_ACCOUNT_ADDRESS')
export const fetchTokens = createAction<{ tokens?: TokenBalances }>('FETCH_TOKENS')
// export const setGasCost = createAction('SET_GAS_COST')
// export const setGasPrice = createAction<{entityType: string, gasPrice: any}> ('SET_GAS_PRICE')
// export const setEtherTokens = createAction('SET_ETHER_TOKENS')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 200000

// CONSIDER: moving this OUT of blockchain into index or some INITIALIZATION action module.
/**
 * (Re)-Initializes Gnosis.js connection according to current providers settings
 */
export const initDutchX = () => async (dispatch: Function, getState: any) => {
  // initialize
  try {
    const state = getState()

    // determine new provider
    const newProvider: any = findDefaultProvider(state)
    if (newProvider) {
      await dispatch(setActiveProvider(newProvider.name))

      // init DutchX connection
      // const opts = getDutchXOptions(newProvider)
      // await initDutchXConnection(opts)
      dispatch(setDutchXInitialized({ initialized: true }))
      // await requestEtherTokens()
    }
  } catch (error) {
    console.warn(`DutchX initialization Error: ${error}`)
    return dispatch(setDutchXInitialized({ error, initialized: false }))
  }

  // connect
  try {
    let account: Account
    let currentBalance: Balance
    let tokenBalances: { name: TokenCode, balance: Balance }[]

    // runs test executions on gnosisjs
    const getConnection = async () => {
      try {
        account = await getCurrentAccount()
        currentBalance = (await getCurrentBalance('ETH', account)).toString()
        // TODO: pass a list of tokens from state or globals, for now ['ETH', 'GNO'] is default
        tokenBalances = (await getTokenBalances())
          .map(({ name, balance }) => {
            if (name === 'ETH') {
              return { 
                name,
                balance: balance.toString(),
              }  
            } 
            return { 
              name,
              balance: (balance.toNumber() / 10 ** 18).toString(),
            }
          })  
        await dispatch(getClosingPrice())
      } catch (e) {
        console.log(e)
      }

    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])

    await dispatch(setCurrentAccountAddress({ currentAccount: account }))
    await dispatch(setCurrentBalance({ currentBalance }))

    // Grab each TokenBalance and dispatch
    tokenBalances.forEach(async token =>
      await dispatch(setTokenBalance({ tokenName: token.name, balance: token.balance })))

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


const errorHandling = (error: Error) => async (dispatch: Function, getState: Function) => {
  const { blockchain: { activeProvider } } = getState()
  const normError = error.message || error
  console.error('Error submitting a sell order', normError)
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

export const submitSellOrder = () => async (dispatch: any, getState: any) => {
  const { tokenPair: { sell, buy, sellAmount, index = 0 }, blockchain: { activeProvider, currentAccount } } = getState()
  try {
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Confirm sell of ${sellAmount} ${sell.toUpperCase()} tokens`,
        body: `Final confirmation: please accept/reject ${sell.toUpperCase()} sell order via ${activeProvider}`,
      },
    }))

    const receipt = await postSellOrder(sell, buy, (+sellAmount * 10 ** 18).toString(), index, currentAccount)
    console.log('Submit order receipt', receipt)

    // close modal
    dispatch(closeModal()) 

    // TODO: pass a list of tokens from state or globals, for now ['ETH', 'GNO'] is default
    const tokenBalances = await getTokenBalances(undefined, currentAccount)
    const { name, balance } = tokenBalances.find(({ name }) => name === sell)

    // new balance for the token just sold
    dispatch(setTokenBalance({ tokenName: name, balance: balance.toString() }))

    // proceed to /auction/0x03494929349594
    dispatch(push(`auction/${sell}-${buy}-${index}`))

    // reset sellAmount
    dispatch(setSellTokenAmount({ sellAmount: 0 }))

    // indicate that submition worked
    return true
  } catch (error) {
    console.error('We are in submitSellOrder just before errorHandling()')
    dispatch(errorHandling(error))
  } 
}

export const getTokenAllowance = () => async (dispatch: Function, getState: Function) => {
  const { tokenPair: { sell, sellAmount }, blockchain: { activeProvider, currentAccount } } = getState()

  try {
    // change to modal with button, new modal
    dispatch(openModal({
      modalName: 'TransactionModal',   
      modalProps: {
        header: `Contacting Ethereum blockchain`,
        body: `Please wait`,
      },
    }))
    const allowanceLeft = (await checkTokenAllowance(sell, currentAccount)).toNumber()
    console.log(allowanceLeft)
    if(sellAmount > allowanceLeft) {
      dispatch(openModal({
        modalName: 'ApprovalModal', 
        modalProps: {
          header: `Confirm ${sell.toUpperCase()} Token movement`,
          body: `Confirmation: DutchX needs your permission to move your ${sell.toUpperCase()} Tokens for this Auction - please check ${activeProvider}`,
        }
      }))
    } else {
      dispatch(submitSellOrder())
    }
  } catch(e) {
    dispatch(errorHandling(e))
  }
}

// TODO: if add index of current tokenPair to state
export const approveAndPostSellOrder = (choice: string) => async (dispatch: Function, getState: any) => {
  const { tokenPair: { sell, buy, sellAmount, index = 0 }, blockchain: { currentAccount } } = getState()
  // don't do anything when submitting a <= 0 amount
  // indicate that nothing happened with false return
  if (sellAmount <= 0) return false
  // Simulate Sell order before real transaction
  try {
    const simResp = await postSellOrder.call(sell, buy, sellAmount, index, currentAccount)
    console.log('simResp == ', simResp)
  } catch (e) {
    // TODO: fire action blocking button
    console.warn('Submit Sell Order', e)
    return
  }

  try {
    // here check if users token Approval amount is high enough and APPROVE else => postSellOrder
    if(choice === 'MIN') {
      // open modal
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Approving minimum token movement: ${sellAmount}`,
          body: `You are approving the minimum amount necessary - DutchX will prompt you again the next time.`,
        },
      }))
      
      const tokenApprovalReceipt = await tokenApproval(sell, sellAmount)
      console.log('Approved token', tokenApprovalReceipt)
    } else {
      // open modal
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Approving maximum token movement`,
          body: `You are approving the maximum amount - you will no longer need to sign 2 transactions.`,
        },
      }))
      
      const tokenApprovalReceipt = await tokenApproval(sell, (100000 * 10 ** 18).toString())
      console.log('Approved token', tokenApprovalReceipt)
    }

    dispatch(submitSellOrder())
  } catch (error) {
    dispatch(errorHandling(error))
  }
}

export const getTokenPairs = async () => {
  // const token1 = await grabTokenAddress1
  // const token2 = await grabTokenAddress2
  // const token = await getTokenPairs( 1, 2, token1, token2 ))
}
