// import { dispatch } from 'redux';
import {
  getCurrentBalance,
  getCurrentAccount,
  // initDutchXConnection,
  getTokenBalances,
  getLatestAuctionIndex,
  postSellOrder,
  closingPrice,
} from 'api'

import { setClosingPrice } from 'actions/ratioPairs'
import { setTokenBalance } from 'actions/tokenBalances'
import { setSellTokenAmount } from 'actions/tokenPair'

import {
  timeoutCondition,
  // getDutchXOptions,
} from '../utils/helpers'
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
        tokenBalances = (await getTokenBalances(undefined, account))
          .map(({ name, balance }) => ({ name, balance: balance.toString() }))
        console.log(tokenBalances)
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
    console.log('FIRING LASTCLOSINGPRICES')
    return dispatch(setClosingPrice({ sell, buy, price: lastPrice }))
  } catch (e) {
    console.log(e)
  }
}

// TODO: if add index of current tokenPair to state
export const submitSellOrder = (proceedTo: string) => async (dispatch: Function, getState: any) => {
  const { tokenPair: { sell, buy, sellAmount, index }, blockchain: { currentAccount } } = getState()

  // don't do anything when submitting a <= 0 amount
  // indicate that nothing happened with false return
  if (sellAmount <= 0) return false

  try {
    !index ? await getLatestAuctionIndex({ sell, buy }) : index
    const receipt = await postSellOrder(sell, buy, sellAmount, index, currentAccount)

    console.log('Submit order receipt', receipt)

    // TODO: pass a list of tokens from state or globals, for now ['ETH', 'GNO'] is default
    const tokenBalances = await getTokenBalances(undefined, currentAccount)
    const { name, balance } = tokenBalances.find(({ name }) => name === sell)

    // new balance for the token just sold
    dispatch(setTokenBalance({ tokenName: name, balance: balance.toString() }))

    // proceed to /auction/0x03494929349594
    dispatch(push(proceedTo))

    // reset sellAmount
    dispatch(setSellTokenAmount({ sellAmount: 0 }))

    // indicate that submition worked
    return true
  } catch (error) {
    console.error('Error submitting a sell order', error.message || error)
    return error
  }
}

export const getTokenPairs = async () => {
  // const token1 = await grabTokenAddress1
  // const token2 = await grabTokenAddress2
  // const token = await getTokenPairs( 1, 2, token1, token2 ))
}

// export const requestGasPrice = () => async (dispatch: Function) => {
//   const gasPrice = await getGasPrice()
//   dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
// }

// export const requestGasCost = contractType => async (dispatch) => {
//   if (contractType === GAS_COST.MARKET_CREATION) {
//     calcMarketGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   } else if (contractType === GAS_COST.BUY_SHARES) {
//     calcBuySharesGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   } else if (contractType === GAS_COST.SELL_SHARES) {
//     calcSellSharesGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   } else if (contractType === GAS_COST.CATEGORICAL_EVENT) {
//     calcCategoricalEventGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   } else if (contractType === GAS_COST.SCALAR_EVENT) {
//     calcScalarEventGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   } else if (contractType === GAS_COST.CENTRALIZED_ORACLE) {
//     calcCentralizedOracleGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   } else if (contractType === GAS_COST.FUNDING) {
//     calcFundingGasCost().then((gasCost) => {
//       dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
//     })
//   }
// }

// export const requestEtherTokens = account => async (dispatch) => {
//   const etherTokens = await getEtherTokens(account)
//   dispatch(setEtherTokens({ entityType: 'etherTokens', account, etherTokens }))
// }

