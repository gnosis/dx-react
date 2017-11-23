import { createAction } from 'redux-actions'
import { TokenMod, TokenCode } from 'types'

import { closingPrice } from 'api/dutchx' 
import { setClosingPrice } from 'actions/ratioPairs'

export const openOverlay = createAction<{ mod: TokenMod }>('OPEN_OVERLAY')
export const closeOverlay = createAction<void>('CLOSE_OVERLAY', () => { })
export const selectTokenAndCloseOverlay = createAction<{ mod: TokenMod, code: TokenCode }>(
  'SELECT_TOKEN_AND_CLOSE_OVERLAY')

export const selectTokenPairAndRatioPair = (props: any) => async (dispatch: Function, getState: any) => {
  const { tokenPair: { sell, buy } } = getState()
  const { code, mod } = props

  let price
  let newSell
  let newBuy
  
  if (mod === 'sell') { 
    newSell = code
    newBuy = buy
    price = (await closingPrice(code, buy)).toString()
  } else {
    newBuy = code
    newSell = sell
    price = (await closingPrice(sell, code)).toString()
  }

  try {
    await dispatch(setClosingPrice({ sell: newSell, buy: newBuy, price }))
    await dispatch(selectTokenAndCloseOverlay({ mod, code }))
  } catch (e) {
    console.error(e)
  }
}  
