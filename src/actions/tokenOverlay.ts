import { createAction } from 'redux-actions'
import { TokenMod, TokenCode } from 'types'

export const openOverlay = createAction<{ mod: TokenMod }>('OPEN_OVERLAY')
// export const closeOverlay = createAction<{ mod: TokenMod }>('CLOSE_OVERLAY')
// TODO: breaks Redux devtools
export const closeOverlay = () => ({
  type: 'CLOSE_OVERLAY',
})
closeOverlay.toString = () => 'CLOSE_OVERLAY'
export const selectTokenAndCloseOverlay = createAction<{ mod: TokenMod, code: TokenCode }>(
  'SELECT_TOKEN_AND_CLOSE_OVERLAY')
