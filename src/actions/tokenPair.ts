import { createAction } from 'redux-actions'
import { TokenPair } from 'types'

import { closingPrice } from 'api/'
import { setClosingPrice } from 'actions/ratioPairs'

export const selectTokenPair = createAction<TokenPair>('SELECT_TOKEN_PAIR')
export const setSellTokenAmount = createAction<{ sellAmount: number }>('SET_SELL_TOKEN_AMOUNT')

export const selectTokenPairAndSetClosingPrice = (tokenPair: TokenPair) => async (dispatch: Function) => {
  const { sell, buy } = tokenPair
  try {
    const price = (await closingPrice(sell, buy)).toString()
    await dispatch(setClosingPrice({ sell, buy, price }))
    await dispatch(selectTokenPair({ buy, sell } as TokenPair))
  } catch (e) {
    console.warn(e)
  }
}
