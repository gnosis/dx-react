import { createAction } from 'redux-actions'
import { TokenMod, TokenPair } from 'types'

import { closingPrice } from 'api/'
import { setClosingPrice } from 'actions/ratioPairs'
import { DefaultTokenObject } from 'api/types'

export const openOverlay = createAction<{ mod: TokenMod }>('OPEN_OVERLAY')
export const closeOverlay = createAction<void>('CLOSE_OVERLAY', () => { })
export const selectTokenAndCloseOverlay = createAction<{ mod: TokenMod, token: DefaultTokenObject }>(
  'SELECT_TOKEN_AND_CLOSE_OVERLAY')

export const selectTokenPairAndRatioPair = (props: any) => async (dispatch: Function, getState: any) => {
  const { tokenPair } = getState()
  const { token, mod } = props
  const { sell, buy }: TokenPair = { ...tokenPair, [mod]: token }

  try {
    const price = (await closingPrice({ sell, buy })).toString()

    // TODO: remove await
    await dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price }))
    await dispatch(selectTokenAndCloseOverlay({ mod, token }))
  } catch (e) {
    console.error(e)
  }
}
