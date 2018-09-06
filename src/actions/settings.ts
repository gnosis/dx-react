import { createAction } from 'redux-actions'
import { State, Settings } from 'types'
import { Dispatch } from 'redux'

import localForage from 'localforage'

export const saveSettings = createAction<Partial<Settings>>('SAVE_SETTINGS')

export const asyncLoadSettings = () => async (dispatch: Dispatch<any>) => {
  const settings = await Promise.all([
    localForage.getItem('settings'),
    localForage.getItem('cookieSettings'),
  ])

  if (settings) {
    return settings.forEach(setting => dispatch(saveSettings(setting)))
  }
}

export const asyncSaveSettings = (payload: Partial<Settings>) =>
  async (dispatch: Dispatch<any>, getState: () => State) => {
    const action = dispatch(saveSettings(payload))

    localForage.setItem('settings', getState().settings)
    return action
  }
