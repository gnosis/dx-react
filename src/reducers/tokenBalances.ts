import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'

import { setTokenBalance } from 'actions/tokenBalances'
// import { codeList } from 'globals'

// const zeroBalance = codeList.reduce((acc, code) => (acc[code] = 0, acc), {}) as TokenBalances

// TODO: fill in when we have actions + fill in rest of Tokens + proper typing
export default handleActions<TokenBalances | any>(
  {
    [setTokenBalance.toString()]: (state, action) => ({
      ...state,
      [action.payload.tokenName]: action.payload.balance,
    }),
  },
  // zeroBalance
  {
    ETH: '0',
    GNO: '0',
  },
)
