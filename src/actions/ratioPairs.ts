import { createAction } from 'redux-actions'
import { Balance, TokenCode } from 'types'

export const setClosingPrice = createAction<{sell: TokenCode, buy: TokenCode, price: Balance}>('SET_CLOSING_PRICE')
