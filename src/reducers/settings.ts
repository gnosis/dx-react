import { handleActions } from 'redux-actions'

import { saveSettings } from 'actions/settings'

const reducer = handleActions({
  [saveSettings.toString()]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
}, {})

export default reducer
