import { handleActions } from 'redux-actions'

import { selectTokenAndCloseOverlay, selectTokenPair, setSellTokenAmount, swapTokensInAPair } from 'actions'
import { TokenPair, DefaultTokenObject, TokenMod } from 'types'

export default handleActions<
TokenPair,
TokenPair & { token: DefaultTokenObject, mod: TokenMod }
>(
  {
    [selectTokenAndCloseOverlay.toString()]: (state, action) => {
      const { mod, token } = action.payload
      return {
        ...state,
        [mod]: token,
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
    [swapTokensInAPair.toString()]: ({ sell, buy }) => ({
      sell: buy,
      buy: sell,
      sellAmount: '0',
      index: '0',
    }),
  },
  {
    sell: {
      name: 'ETHER',
      symbol: 'ETH',
      decimals: 18,
      address: undefined,
    },
    buy: {
      name: 'GNOSIS',
      symbol: 'GNO',
      decimals: 18,
      address: undefined,
    },
    sellAmount: '0',
    index: '0',
  },
)
