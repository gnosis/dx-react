import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import balance from 'contract-fe-test/reducers'
import entities from './entities'
import modal from './modal'
import transactions from './transactions'
import blockchain from './blockchain'
import settings from './settings'
import notifications from './notifications'

const reducers = combineReducers({
  form: formReducer,
  modal,
  entities,
  transactions,
  blockchain,
  settings,
  notifications,
  balance,
})

const rootReducer = (state, action) => {
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
