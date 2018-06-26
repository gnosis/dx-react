import { handleActions } from 'redux-actions'

import {
  closeOverlay,
  openOverlay,
  selectTokenAndCloseOverlay,
  resetTokenPairAndCloseOverlay,
} from 'actions'
import { TokenOverlay } from 'types'

const closeOverlayReducer = (state: TokenOverlay): TokenOverlay => ({
  ...state,
  open: false,
  mod: null,
})

export default handleActions<TokenOverlay>(
  {
    [openOverlay.toString()]: (state, action) => ({
      ...state,
      open: true,
      mod: action.payload.mod,
    }),
    [closeOverlay.toString()]: closeOverlayReducer,
    [selectTokenAndCloseOverlay.toString()]: closeOverlayReducer,
    [resetTokenPairAndCloseOverlay.toString()]: closeOverlayReducer,
  },
  {
    open: false,
    mod: null,
  },
)
