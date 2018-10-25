import { handleActions } from 'redux-actions'

import {
  setActiveProvider,
  setConnectionStatus,
  setAppInitialised,
  registerProvider,
  updateProvider,
  setCurrentBalance,
  setCurrentAccountAddress,
  fetchTokens,
  setFeeRatio,
  setTokenSupply,
  resetAppState,
  setOWLPreference,
} from 'actions/blockchain'
import { setAppLoadBypass } from 'middlewares/AppLoadBypass'

import { Blockchain, Provider } from 'types'

const INITIAL_PROVIDER_STATE: Provider = {
  loaded: false,
  available: true,
  unlocked: false,
  network: undefined,
  account: undefined,
  balance: undefined,
  priority: 1,
  type: undefined,
  keyName: undefined,
}

const initialState: Blockchain = {
  connectionTried: false,
  providers: undefined,
  activeProvider: null,
  currentAccount: undefined,
  currentBalance: undefined,
  network: undefined,
  feeRatio: undefined,
  mgnSupply: undefined,
  useOWL: undefined,
  appLoadBypass: false,
}

const reducer = handleActions({
  [setAppLoadBypass.toString()]: (state, action) => ({
    ...state,
    appLoadBypass: action.payload,
  }),

  [setConnectionStatus.toString()]: (state, action) => {
    const { connected } = action.payload
    return {
      ...state,
      connected,
      connectionTried: true,
    }
  },
  [setAppInitialised.toString()]: (state: any, action: any) => {
    const { initialized } = action.payload
    return {
      ...state,
      appInitialised: initialized,
    }
  },
  [registerProvider.toString()]: (state: any, action: any) => {
    const { provider: name, ...provider } = action.payload
    return {
      ...state,
      // activeProvider: name,
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
  [updateProvider.toString()]: (state: any, action: any) => {
    const { provider: name, ...provider } = action.payload

    return {
      ...state,
      network: provider.network,
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
  [setActiveProvider.toString()]: (state: any, action: any) => ({
    ...state,
    activeProvider: action.payload,
  }),
  [setCurrentAccountAddress.toString()]: (state: any, action: any) => ({
    ...state,
    currentAccount: action.payload.currentAccount,
  }),
  [setCurrentBalance.toString()]: (state: any, action: any) => ({
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
  [setOWLPreference.toString()]: (state, action) => ({
    ...state,
    useOWL: action.payload,
  }),
  [resetAppState.toString()]: (state: Blockchain) => ({
    ...state,
    ...initialState,
    activeProvider: state.activeProvider,
    providers: state.providers,
  }),
},
  initialState,
)

export default reducer
