import { handleActions } from 'redux-actions'

import { selectTokenAndCloseOverlay } from 'actions'
import { TokenPair, TokenMod } from 'types'
import { TokenItemProps } from 'components/TokenItem'

const mod2Prop: {[P in TokenMod]: string} = {
  SELL: 'sell',
  RECEIVE: 'buy',
}

export default handleActions<TokenPair, TokenItemProps>(
  {
    [selectTokenAndCloseOverlay.toString()]: (state, action) => {
      const { mod, code } = action.payload
      return {
        ...state,
        [mod2Prop[mod]]: code,
      }
    },
  },
  {
    sell: 'ETH',
    buy: 'GNO',
  },
)
