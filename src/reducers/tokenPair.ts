import { handleActions } from 'redux-actions'

import { selectTokenAndCloseOverlay, selectTokenPair, setSellTokenAmount } from 'actions'
import { TokenPair, Balance } from 'types'
import { TokenItemProps } from 'components/TokenItem'

export default handleActions<TokenPair & { sellAmount: Balance }, TokenItemProps & TokenPair>(
  {
    [selectTokenAndCloseOverlay.toString()]: (state, action) => {
      const { mod, code } = action.payload as TokenItemProps
      return {
        ...state,
        [mod]: code,
        sellAmount: '0',
      }
    },
    [selectTokenPair.toString()]: (_, action) => ({
      ...action.payload,
      sellAmount: '0',
    }),
    [setSellTokenAmount.toString()]: (state, action) => ({
      ...state,
      // TODO: restrict payload.sellAmount to [0, tokenBalances[state.sell]]
      ...action.payload,
    }),
  },
  {
    sell: 'ETH',
    buy: 'GNO',
    sellAmount: '0',
    index: '0',
  },
)
