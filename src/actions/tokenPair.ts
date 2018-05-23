import { createAction } from 'redux-actions'
import { TokenPair, Balance } from 'types'

import { closingPrice } from 'api/'
import { setClosingPrice } from 'actions/ratioPairs'

export const selectTokenPair = createAction<TokenPair>('SELECT_TOKEN_PAIR')
export const setSellTokenAmount = createAction<{ sellAmount: Balance }>('SET_SELL_TOKEN_AMOUNT')
export const swapTokensInAPair = createAction<void>('SWAP_TOKENS_IN_A_PAIR', () => {})

export const selectTokenPairAndSetClosingPrice = (tokenPair: TokenPair) => async (dispatch: Function) => {
  const { sell, buy } = tokenPair
  try {
    const price = (await closingPrice({ sell, buy })).toString()

    dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price }))
    return dispatch(selectTokenPair({ buy, sell } as TokenPair))
  } catch (e) {
    console.warn(e)
  }
}
