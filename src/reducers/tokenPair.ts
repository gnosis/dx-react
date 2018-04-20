import { handleActions } from 'redux-actions'

import { selectTokenAndCloseOverlay, selectTokenPair, setSellTokenAmount, swapTokensInAPair } from 'actions'
import { TokenPair, DefaultTokenObject, TokenMod } from 'types'

// TODO: fill in state with dispatch in or around getDefaultTokens
const initialState: TokenPair = {
  sell: {
    name: 'ETHER',
    symbol: 'ETH',
    address: '0x254dffcd3277c0b1660f6d42efbb754edababc2b',
    decimals: 18,
  },
  buy: {
    name: 'GNOSIS',
    symbol: 'GNO',
    address: '0xc89ce4735882c9f0f0fe26686c53074e09b0d550',
    decimals: 18,
  },
  sellAmount: '0',
  index: '0',
}

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
  initialState,
)
