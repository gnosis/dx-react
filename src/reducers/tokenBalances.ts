import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'

import { setTokenBalance } from 'actions/tokenBalances'
// import { codeList } from 'globals'

// const zeroBalance = codeList.reduce((acc, code) => (acc[code] = 0, acc), {}) as TokenBalances

// TODO: fill in state with dispatch in or around getDefaultTokens
const initialState: TokenBalances = {
  '0x254dffcd3277c0b1660f6d42efbb754edababc2b': '0',
  '0xc89ce4735882c9f0f0fe26686c53074e09b0d550': '0',
}

// TODO: fill in when we have actions + fill in rest of Tokens + proper typing
export default handleActions<TokenBalances>(
  {
    [setTokenBalance.toString()]: (state: any, action: any) => ({
      ...state,
      [action.payload.tokenName]: action.payload.balance,
    }),
  },
  // zeroBalance
  initialState,
)
