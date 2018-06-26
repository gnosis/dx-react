import { createAction } from 'redux-actions'
import { TokenMod, TokenPair } from 'types'

import { swapTokensInAPair, getClosingPrice } from 'actions'
import { DefaultTokenObject } from 'api/types'

export const openOverlay = createAction<{ mod: TokenMod }>('OPEN_OVERLAY')
export const closeOverlay = createAction<void>('CLOSE_OVERLAY', () => { })
export const selectTokenAndCloseOverlay = createAction<{ mod: TokenMod, token: DefaultTokenObject }>(
  'SELECT_TOKEN_AND_CLOSE_OVERLAY')
export const resetTokenPairAndCloseOverlay = createAction<void>(
  'RESET_TOKEN_AND_CLOSE_OVERLAY', () => {})

type PropsType = { mod: TokenMod, token: DefaultTokenObject }

export const selectTokenPairAndRatioPair = (props: PropsType) => async (dispatch: Function, getState: any) => {
  const { tokenPair } = getState()
  const { token, mod } = props
  console.log('props: ', props)

  // user chose the same token for the same position
  // don't do anything
  if (tokenPair[mod] && tokenPair[mod].address === token.address) {
    return dispatch(closeOverlay())
  }
  const { sell, buy }: TokenPair = { ...tokenPair, [mod]: token }

  // user chose buy token in place of sell token or the reverse
  // just switch them
  if ((sell && buy) && (sell.address === buy.address)) {
    dispatch(swapTokensInAPair())
    await dispatch(getClosingPrice())
    return dispatch(closeOverlay())
  }

  try {
    // TODO: dispatch getClosingPrice action
    // which would also add closingPrice to TokenPair state
    dispatch(selectTokenAndCloseOverlay({ mod, token }))
    return dispatch(getClosingPrice())
  } catch (e) {
    console.error(e)
  }
}
