import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'

import { setTokenBalance, resetAppState } from 'actions'

export default handleActions<TokenBalances>(
  {
    [setTokenBalance.toString()]: (state: any, action: any) => ({
      ...state,
      [action.payload.address]: action.payload.balance,
    }),
    [resetAppState.toString()]: () => ({}),
  },
  // zeroBalance
  {},
)
