import { handleActions } from 'redux-actions'

import {
  setActiveProvider,   
  setConnectionStatus, 
  setDutchXInitialized,
  // setGasCost, 
  // setGasPrice, 
  registerProvider, 
  updateProvider, 
  // setEtherTokens,
} from 'actions/blockchain'

import { GAS_COST } from 'utils/constants'

const reducer = handleActions({
  [setConnectionStatus as any]: (state, action) => {
    const { connection } = action.payload
    return {
      ...state,
      connection,
      connectionTried: true,
    }
  },
  [setDutchXInitialized as any]: (state: any, action: any) => {
    const { initialized } = action.payload
    return {
      ...state,
      dutchXInitialized: initialized,
    }
  },
  // [setGasCost]: (state, action) => ({
  //   ...state,
  //   [action.payload.entityType]: {
  //     ...state[action.payload.entityType],
  //     [action.payload.contractType]: action.payload.gasCost,
  //   },
  // }),
  // [setGasPrice]: (state, action) => ({
  //   ...state,
  //   [action.payload.entityType]: action.payload.gasPrice,
  // }),
  [registerProvider as any]: (state: any, action: any) => {
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
  [updateProvider as any]: (state: any, action: any) => {
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
      providersLoaded: true,
    }
  },
  [setActiveProvider as any]: (state: any, action: any) => ({
    ...state,
    activeProvider: action.payload
  }),
  // [setEtherTokens]: (state, action) => ({
  //   ...state,
  //   [action.payload.entityType]: {
  //     ...state[action.payload.entityType],
  //     [action.payload.account]: action.payload.etherTokens,
  //   },
  // }),
}, {
  gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
  gasPrice: undefined,
  currentBalance: undefined,
  connection: undefined,
  connectionTried: false,
  providers: {},
  activeProvider: null,
})

export default reducer
