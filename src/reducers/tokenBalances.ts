import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'

import { setTokenBalance } from 'actions/tokenBalances'
export default handleActions<TokenBalances>(
  {
    [setTokenBalance.toString()]: (state: any, action: any) => ({
      ...state,
      [action.payload.address]: action.payload.balance,
    }),
  },
  // zeroBalance
  {},
)
