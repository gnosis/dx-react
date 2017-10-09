import { handleActions } from 'redux-actions'

import {
  setDefaultAccount, setCurrentBalance, setConnectionStatus, setGnosisInitialized,
  setGasCost, setGasPrice, registerProvider, updateProvider, setEtherTokens,
} from 'actions/blockchain'
import { GAS_COST } from 'utils/constants'

const reducer = handleActions({
  [setDefaultAccount]: (state, action) => {
    const account = action.payload
    return {
      ...state,
      defaultAccount: account,
    }
  },
  [setCurrentBalance]: (state, action) => {
    const balance = action.payload
    return {
      ...state,
      currentBalance: balance,
    }
  },
  [setConnectionStatus]: (state, action) => {
    const { connection } = action.payload
    return {
      ...state,
      connection,
      connectionTried: true,
    }
  },
  [setGnosisInitialized]: (state, action) => {
    const { initialized } = action.payload
    return {
      ...state,
      gnosisInitialized: initialized,
    }
  },
  [setGasCost]: (state, action) => ({
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.contractType]: action.payload.gasCost,
    },
  }),
  [setGasPrice]: (state, action) => ({
    ...state,
    [action.payload.entityType]: action.payload.gasPrice,
  }),
  [registerProvider]: (state, action) => {
    const { provider: name, ...provider } = action.payload
    return {
      ...state,
      providers: {
        ...state.providers,
        [name]: {
          name,
          loaded: false,
          ...provider,
        },
      },
    }
  },
  [updateProvider]: (state, action) => {
    const { provider: name, ...provider } = action.payload

    return {
      ...state,
      providers: {
        ...state.providers,
        [name]: {
          ...state.providers[name],
          loaded: true,
          ...provider,
        },
      },
      activeProvider: !state.activeProvider && provider.available ? name : state.activeProvider,
      providersLoaded: true,
    }
  },
  [setEtherTokens]: (state, action) => ({
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.account]: action.payload.etherTokens,
    },
  }),
}, {
  gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
  gasPrice: undefined,
  defaultAccount: undefined,
  currentBalance: undefined,
  connection: undefined,
  connectionTried: false,
  providers: {},
  activeProvider: null,
  etherTokens: undefined,
})

export default reducer
