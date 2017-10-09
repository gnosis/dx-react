import {
  initGnosisConnection,
  getCurrentBalance,
  getCurrentAccount,
  calcMarketGasCost,
  calcBuySharesGasCost,
  calcSellSharesGasCost,
  calcCategoricalEventGasCost,
  calcScalarEventGasCost,
  calcCentralizedOracleGasCost,
  calcFundingGasCost,
  getGasPrice,
  getEtherTokens,
} from 'api'

import { hexWithPrefix, timeoutCondition } from 'utils/helpers'
import { GAS_COST } from 'utils/constants'
import { createAction } from 'redux-actions'

// TODO define reducer for GnosisStatus
export const setGnosisInitialized = createAction('SET_GNOSIS_CONNECTION')
export const setDefaultAccount = createAction('SET_DEFAULT_ACCOUNT')
export const setCurrentBalance = createAction('SET_CURRENT_BALANCE')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setGasCost = createAction('SET_GAS_COST')
export const setGasPrice = createAction('SET_GAS_PRICE')
export const registerProvider = createAction('REGISTER_PROVIDER')
export const updateProvider = createAction('UPDATE_PROVIDER')
export const setEtherTokens = createAction('SET_ETHER_TOKENS')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

/**
 * Initializes Gnosis connection
 * @param {*dictionary} opts
 */
export const initGnosis = opts => async (dispatch) => {
  try {
    await initGnosisConnection(opts)
    await dispatch(setGnosisInitialized({ initialized: true }))
  } catch (error) {
    dispatch(setGnosisInitialized({ initialized: false, error }))
  }
}

export const connectBlockchain = () => async (dispatch) => {
  try {
    let account
    let balance
    const getConnection = async () => {
      account = await getCurrentAccount()
      balance = await getCurrentBalance(account)
    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
    await dispatch(setDefaultAccount(hexWithPrefix(account)))
    // update current balance
    dispatch(setCurrentBalance(balance))
    return await dispatch(setConnectionStatus({ connected: true }))
  } catch (e) {
    console.warn(`Blockchain connection Error: ${e}`)
    return await dispatch(setConnectionStatus({ connected: false }))
  }
}

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestGasCost = contractType => async (dispatch) => {
  if (contractType === GAS_COST.MARKET_CREATION) {
    calcMarketGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.BUY_SHARES) {
    calcBuySharesGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.SELL_SHARES) {
    calcSellSharesGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.CATEGORICAL_EVENT) {
    calcCategoricalEventGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.SCALAR_EVENT) {
    calcScalarEventGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.CENTRALIZED_ORACLE) {
    calcCentralizedOracleGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  } else if (contractType === GAS_COST.FUNDING) {
    calcFundingGasCost().then((gasCost) => {
      dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
    })
  }
}

export const requestEtherTokens = account => async (dispatch) => {
  const etherTokens = await getEtherTokens(account)
  dispatch(setEtherTokens({ entityType: 'etherTokens', account, etherTokens }))
}
