import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'

import { setTokenBalance } from 'actions/tokenBalances'
// import { codeList } from 'globals'

// const zeroBalance = codeList.reduce((acc, code) => (acc[code] = 0, acc), {}) as TokenBalances

// TODO: fill in state with dispatch in or around getDefaultTokens
const initialState: TokenBalances = {
  '0xcfeb869f69431e42cdb54a4f4f105c19c080a601': '0',
  '0x254dffcd3277c0b1660f6d42efbb754edababc2b': '0',
}

// TODO: fill in when we have actions + fill in rest of Tokens + proper typing
export default handleActions<TokenBalances>(
  {
    [setTokenBalance.toString()]: (state: any, action: any) => ({
      ...state,
      [action.payload.address]: action.payload.balance,
    }),
  },
  // zeroBalance
  initialState,
)
