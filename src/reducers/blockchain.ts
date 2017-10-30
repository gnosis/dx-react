import { handleActions } from 'redux-actions'

import {
  setActiveProvider,   
  setConnectionStatus, 
  setDutchXInitialized,
  registerProvider, 
  updateProvider,
  setCurrentBalance,
  setCurrentAccountAddress, 
  // setGasCost, 
  // setGasPrice, 
  // setEtherTokens,
} from 'actions/blockchain'

import { GAS_COST } from 'utils/constants'

const INITIAL_PROVIDER_STATE: any = {
  loaded: false,
  available: false,
  network: undefined,
  account: undefined,
  balance: undefined,
  priority: 1,
}

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
  [registerProvider as any]: (state: any, action: any) => {
    const { provider: name, ...provider } = action.payload
    return {
      ...state,
      providers: {
        ...state.providers,
        [name]: {
          name,
          ...INITIAL_PROVIDER_STATE,
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
    activeProvider: action.payload,
  }),
  [setCurrentAccountAddress as any]: (state: any, action: any) => ({
    ...state,
    currentAccount: action.payload.currentAccount,
  }),
  [setCurrentBalance as any]: (state: any, action: any) => ({
    ...state,
    currentBalance: action.payload.currentBalance,
  }),
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
  // [setEtherTokens]: (state, action) => ({
    //   ...state,
    //   [action.payload.entityType]: {
  //     ...state[action.payload.entityType],
  //     [action.payload.account]: action.payload.etherTokens,
  //   },
  // }),
},                            {
  gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
  gasPrice: undefined,
  connection: undefined,
  connectionTried: false,
  providers: {},
  activeProvider: null,
  currentAccount: undefined,
  currentBalance: undefined,
})

export default reducer
