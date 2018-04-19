import { createAction } from 'redux-actions'
import { TokenMod, DefaultTokenObject, TokenPair } from 'types'

import { closingPrice } from 'api/'
import { setClosingPrice } from 'actions/ratioPairs'

export const openOverlay = createAction<{ mod: TokenMod }>('OPEN_OVERLAY')
export const closeOverlay = createAction<void>('CLOSE_OVERLAY', () => { })
export const selectTokenAndCloseOverlay = createAction<{ mod: TokenMod, token: DefaultTokenObject }>(
  'SELECT_TOKEN_AND_CLOSE_OVERLAY')

export const selectTokenPairAndRatioPair = (props: any) => async (dispatch: Function, getState: any) => {
  const { tokenPair } = getState()
  const { code, mod } = props
  const { sell, buy }: TokenPair = { ...tokenPair, [mod]: code }

  try {
    const price = (await closingPrice(sell, buy)).toString()

    await dispatch(setClosingPrice({ sell, buy, price }))
    await dispatch(selectTokenAndCloseOverlay({ mod, code }))
  } catch (e) {
    console.error(e)
  }
}  
