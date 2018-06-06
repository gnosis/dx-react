import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'

import { closingPrice } from 'api'
import { setClosingPrice, getClosingPrice } from 'actions'

import { TokenPair, Balance } from 'types'

export const selectTokenPair = createAction<TokenPair>('SELECT_TOKEN_PAIR')
export const setSellTokenAmount = createAction<{ sellAmount: Balance }>('SET_SELL_TOKEN_AMOUNT')
export const swapTokensInAPair = createAction<void>('SWAP_TOKENS_IN_A_PAIR', () => {})

export const swapTokensInAPairAndReCalcClosingPrice = () => async (dispatch: Dispatch<any>) => {
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
