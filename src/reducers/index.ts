import { combineReducers, Reducer } from 'redux'
import { State } from 'types'
import { reducer as formReducer } from 'redux-form'
import auctions from './auctions'
import blockchain from './blockchain'
import ipfs from './ipfs'
import modal from './modal'
import ratioPairs from './ratioPairs'
import settings from './settings'
import approvedTokens from './approvedTokens'
import tokenBalances from './tokenBalances'
import tokenList from './tokenList'
import tokenOverlay from './tokenOverlay'
import tokenPair from './tokenPair'
import { reducer as LOGS_AND_EVENTS } from 'actions/events'

import dxBalances from 'actions/dxBalances'

const reducers = combineReducers<State>({
  form: formReducer,
  auctions,
  blockchain,
  ipfs,
  modal,
  ratioPairs,
  settings,
  approvedTokens,
  tokenBalances,
  tokenList,
  tokenOverlay,
  tokenPair,
  LOGS_AND_EVENTS,

  dxBalances,
})

const rootReducer: Reducer<State> = (state, action) => {
  let resultState = state
  if (action.type === 'LOAD_LOCALSTORAGE') {
    resultState = {
      ...state,
      ...action.payload,
    }
  }
  return reducers(resultState, action)
}

export default rootReducer
