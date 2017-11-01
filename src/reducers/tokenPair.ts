import { handleActions } from 'redux-actions'

import { selectTokenAndCloseOverlay, selectTokenPair } from 'actions'
import { TokenPair } from 'types'
import { TokenItemProps } from 'components/TokenItem'

export default handleActions<TokenPair, TokenItemProps & TokenPair>(
  {
    [selectTokenAndCloseOverlay.toString()]: (state, action) => {
      const { mod, code } = action.payload as TokenItemProps
      return {
        ...state,
        [mod]: code,
      }
    },
    [selectTokenPair.toString()]: (_, action) => action.payload,
  },
  {
    sell: 'ETH',
    buy: 'GNO',
  },
)
