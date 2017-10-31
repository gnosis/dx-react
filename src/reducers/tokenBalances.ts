import { handleActions } from 'redux-actions'
import { TokenBalances } from 'types'
import { codeList } from 'globals'

const zeroBalance = codeList.reduce((acc, code) => (acc[code] = 0, acc), {}) as TokenBalances

// TODO: fill in when we have actions
export default handleActions<TokenBalances>(
  {
  },
  zeroBalance,
)
