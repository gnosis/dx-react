import { setApprovedTokens } from 'actions'
import { handleActions } from 'redux-actions'
import { AccountsSet } from 'types'


const reducer = handleActions<AccountsSet>(
  {
    [setApprovedTokens.toString()]: (_, action) => new Set(action.payload), 
  }, 
  new Set(),
)

export default reducer
