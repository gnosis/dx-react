import { handleActions } from 'redux-actions'

import { saveSettings } from 'actions/settings'
import { Settings } from 'types'

const reducer = handleActions<Settings>({
  [saveSettings.toString()]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
}, {} as Settings)

export default reducer
