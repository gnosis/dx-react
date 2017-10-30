import { createAction } from 'redux-actions'
import { TokenMod } from 'types'

export const openOverlay = createAction<{ mod: TokenMod }>('OPEN_OVERLAY')
export const closeOverlay = createAction('CLOSE_OVERLAY')
export const selectTokenAndCloseOverlay = createAction<{ mod: TokenMod }>('SELECT_TOKEN_AND_CLOSE_OVERLAY')
