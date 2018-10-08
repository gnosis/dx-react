import { handleActions } from 'redux-actions'

import {
  selectTokenAndCloseOverlay,
  selectTokenPair,
  setSellTokenAmount,
  swapTokensInAPairWithDefaultWETH,
  setClosingPrice,
  resetTokenPair,
  resetTokenPairAndCloseOverlay,
} from 'actions'
import { TokenPair, DefaultTokenObject, TokenMod } from 'types'
import { ETH_ADDRESS } from 'globals'

const initialState: TokenPair = {
  sell: {
    name: 'ETHER',
    symbol: 'ETH',
    decimals: 18,
    address: ETH_ADDRESS,
    isETH: true,
  },
  buy: undefined,
  sellAmount: '0',
  index: '0',
  lastPrice: '0',
}

export default handleActions<
TokenPair,
{ token: DefaultTokenObject, mod: TokenMod, price: string } & { WETH_TOKEN: DefaultTokenObject}
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
    [selectTokenPair.toString()]: (state, action) => ({
      ...state,
      sellAmount: '0',
      ...action.payload,
    }),
    [setSellTokenAmount.toString()]: (state, action) => ({
      ...state,
      // TODO: restrict payload.sellAmount to [0, tokenBalances[state.sell]]
      ...action.payload,
    }),
    [swapTokensInAPairWithDefaultWETH.toString()]: (state, action) => ({
      ...state,
      sell: state.buy,
      buy: state.sell && state.sell.isETH ? action.payload.WETH_TOKEN : state.sell,
      sellAmount: '0',
    }),
    [setClosingPrice.toString()]: (state, action) => ({ ...state, lastPrice: action.payload.price }),
    [resetTokenPair.toString()]: () => initialState,
    [resetTokenPairAndCloseOverlay.toString()]: () => initialState,
  },
  initialState,
)
