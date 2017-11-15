import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'
// import { codeList } from 'globals'

// const zeroBalance = codeList.reduce((acc, code) => (acc[code] = 0, acc), {}) as TokenBalances

// TODO: fill in when we have actions + fill in rest of Tokens
export default handleActions<TokenBalances>(
  {
  },
  // zeroBalance
  {
    ETH: undefined,
    GNO: undefined,
  },
)
