import { 
  getCurrentBalance,
  getCurrentAccount,
  initDutchXConnection 
} from '../api/dutchx'

import { timeoutCondition, getDutchXOptions } from '../utils/helpers'
// import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'
import { findDefaultProvider } from '../selectors/blockchain'

export enum TypeKeys {
  SET_GNOSIS_CONNECTION = "SET_GNOSIS_CONNECTION",
  SET_CONNECTION_STATUS = "SET_CONNECTION_STATUS",
  SET_ACTIVE_PROVIDER = "SET_ACTIVE_PROVIDER",
  SET_GAS_COST = "SET_GAS_COST",
  SET_GAS_PRICE = "SET_GAS_PRICE",
  REGISTER_PROVIDER = "REGISTER_PROVIDER",
  UPDATE_PROVIDER = "UPDATE_PROVIDER",
  SET_ETHER_TOKENS = "SET_ETHER_TOKENS",
  OTHER_ACTIONS = "OTHER_ACTIONS",
}

// TODO define reducer for GnosisStatus
export const setDutchXInitialized = createAction<{initialized?: boolean, error?: any}>('SET_DUTCHX_CONNECTION')
export const setConnectionStatus = createAction<{connected?: boolean}>('SET_CONNECTION_STATUS')
export const setActiveProvider = createAction<{provider?: string}>('SET_ACTIVE_PROVIDER')
export const registerProvider = createAction<{provider?: string, data?: Object}>('REGISTER_PROVIDER')
export const updateProvider = createAction<{provider?: string, data?: Object}>('UPDATE_PROVIDER')
// export const setGasCost = createAction('SET_GAS_COST')
// export const setGasPrice = createAction<{entityType: string, gasPrice: any}> ('SET_GAS_PRICE')
// export const setEtherTokens = createAction('SET_ETHER_TOKENS')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

/**
 * (Re)-Initializes Gnosis.js connection according to current providers settings
 */
export const initDutchX = () => async (dispatch: Function, getState: any) => {
  // initialize
  try {
    const state = getState()

    // determine new provider
    const newProvider = findDefaultProvider(state)

    if (newProvider) {
      await dispatch(setActiveProvider(newProvider.name))

      // init DutchX connection
      const opts = getDutchXOptions(newProvider)
      await initDutchXConnection(opts)
      await dispatch(setDutchXInitialized({ initialized: true }))
      // await requestEtherTokens()
    }
  } catch (error) {
    console.warn(`DutchX initialization Error: ${error}`)
    return await dispatch(setDutchXInitialized({ initialized: false, error }))
  }

  // connect
  try {
    // runs test executions on gnosisjs
    const getConnection = async () => {
      const account = await getCurrentAccount()
      await getCurrentBalance(account)
    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
    return await dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    console.warn(`DutchX connection Error: ${error}`)
    return await dispatch(setConnectionStatus({ connected: false }))
  }
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

