import { handleActions } from 'redux-actions'

import { closeOverlay, openOverlay, selectTokenAndCloseOverlay } from 'actions'
import { TokenOverlay } from 'types'

export default handleActions<TokenOverlay>(
  {
    [closeOverlay.toString()]: state => ({
      ...state,
      open: false,
      mode: null,
    }),
    [openOverlay.toString()]: (state, action) => ({
      ...state,
      open: true,
      mod: action.payload.mod,
    }),
    [selectTokenAndCloseOverlay.toString()]: state => ({
      ...state,
      open: false,
      mod: null,
    }),
  },
  {
    open: false,
    mod: null,
  },
)
