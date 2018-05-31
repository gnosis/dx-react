import { combineReducers, Reducer } from 'redux'
import { State } from 'types'
import { reducer as formReducer } from 'redux-form'
import auctions from './auctions'
import blockchain from './blockchain'
import ipfs from './ipfs'
import entities from './entities'
import modal from './modal'
import notifications from './notifications'
import ratioPairs from './ratioPairs'
import settings from './settings'
import approvedTokens from './approvedTokens'
import tokenBalances from './tokenBalances'
import tokenList from './tokenList'
import tokenOverlay from './tokenOverlay'
import tokenPair from './tokenPair'
import transactions from './transactions'

const reducers = combineReducers<State>({
  form: formReducer,
  auctions,
  blockchain,
  entities,
  ipfs,
  modal,
  notifications,
  ratioPairs,
  settings,
  approvedTokens,
  tokenBalances,
  tokenList,
  tokenOverlay,
  tokenPair,
  transactions,
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
