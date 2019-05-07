import { createAction } from 'redux-actions'

import { closingPrice } from 'api'
import { setClosingPrice, getClosingPrice } from 'actions'

import { TokenPair, Balance, State, DefaultTokenObject } from 'types'
import { getTokenByFields } from 'selectors'
import { WETH_TEMPLATE } from 'tokens'

export const selectTokenPair = createAction<Partial<TokenPair>>('SELECT_TOKEN_PAIR')
export const setSellTokenAmount = createAction<{ sellAmount: Balance }>('SET_SELL_TOKEN_AMOUNT')
export const resetTokenPair = createAction<void>('RESET_TOKEN_PAIR', () => {})

export const swapTokensInAPairWithDefaultWETH = createAction<{ WETH_TOKEN : DefaultTokenObject}>('SWAP_TOKENS_IN_A_PAIR')
export const swapTokensInAPair = () => (dispatch: Function, getState: () => State) => {
  const WETH_TOKEN = getTokenByFields(getState(), WETH_TEMPLATE)
  dispatch(swapTokensInAPairWithDefaultWETH({ WETH_TOKEN }))
}

export const swapTokensInAPairAndReCalcClosingPrice = () => async (dispatch: Function) => {
  dispatch(swapTokensInAPair())

  return dispatch(getClosingPrice())
}

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
