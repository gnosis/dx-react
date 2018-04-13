import { setApprovedTokens } from 'actions'
import { handleActions } from 'redux-actions'
import { State } from 'types'


const reducer = handleActions<State['approvedTokens']>(
  {
    [setApprovedTokens.toString()]: (_, action) => new Set(action.payload), 
  }, 
  new Set(),
)

export default reducer
