import { handleActions } from 'redux-actions'

import { selectTokenAndCloseOverlay } from 'actions'
import { TokenPair } from 'types'
import { TokenItemProps } from 'components/TokenItem'

export default handleActions<TokenPair, TokenItemProps>(
  {
    [selectTokenAndCloseOverlay.toString()]: (state, action) => {
      const { mod, code } = action.payload
      return {
        ...state,
        [mod]: code,
      }
    },
  },
  {
    sell: 'ETH',
    buy: 'GNO',
  },
)
