import { handleActions } from 'redux-actions'

import {
  setActiveProvider,
  setConnectionStatus,
  setDutchXInitialized,
  registerProvider,
  updateProvider,
  setCurrentBalance,
  setCurrentAccountAddress,
  fetchTokens,
  setFeeRatio,
  setTokenSupply,
  resetAppState,
} from 'actions/blockchain'

import { GAS_COST } from 'utils/constants'
import { Blockchain, Provider } from 'types'

const INITIAL_PROVIDER_STATE: Provider = {
  loaded: false,
  available: false,
  network: undefined,
  account: undefined,
  balance: undefined,
  priority: 1,
}

const initialState: Blockchain = {
  gasCosts: Object.keys(GAS_COST).reduce((acc, item) => ({ ...acc, [GAS_COST[item]]: undefined }), {}),
  gasPrice: undefined,
  connectionTried: false,
  providers: {},
  activeProvider: null,
  currentAccount: undefined,
  currentBalance: undefined,
  feeRatio: undefined,
  mgnSupply: undefined,
}

const reducer = handleActions({
  [setConnectionStatus as any]: (state, action) => {
    const { connected } = action.payload
    return {
      ...state,
      connected,
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
          ...INITIAL_PROVIDER_STATE,
          name,
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
  [fetchTokens.toString()]: (state: Blockchain, action: any) => ({
    ...state,
    tokens: action.payload,
  }),
  [setFeeRatio.toString()]: (state: Blockchain, action: any) => ({
    ...state,
    feeRatio: action.payload.feeRatio,
  }),
  [setTokenSupply.toString()]: (state: Blockchain, action: any) => ({
    ...state,
    mgnSupply: action.payload.mgnSupply,
  }),
  [resetAppState.toString()]: (state: Blockchain) => ({
    ...state,
    ...initialState,
    providers: state.providers,
  }),
},
  initialState,
)

export default reducer
