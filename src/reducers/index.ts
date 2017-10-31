import { combineReducers, Reducer } from 'redux'
import { State } from 'types'
import { reducer as formReducer } from 'redux-form'
import entities from './entities'
import modal from './modal'
import transactions from './transactions'
import blockchain from './blockchain'
import tokenOverlay from './tokenOverlay'
import tokenPair from './tokenPair'
import tokenBalances from './tokenBalances'
import ratioPairs from './ratioPairs'
import settings from './settings'
import notifications from './notifications'

const reducers = combineReducers<State>({
  form: formReducer,
  modal,
  entities,
  transactions,
  blockchain,
  tokenOverlay,
  tokenPair,
  tokenBalances,
  ratioPairs,
  notifications,
  settings,
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
