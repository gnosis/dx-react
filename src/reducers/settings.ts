import { handleActions } from 'redux-actions'

import { saveSettings } from 'actions/settings'
import { Settings, CookieSettings } from 'types'

const reducer = handleActions<Settings & CookieSettings>({
  [saveSettings.toString()]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
}, {} as Settings & CookieSettings)

export default reducer
