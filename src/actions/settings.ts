import { createAction } from 'redux-actions'
import { State, Settings } from 'types'
import { Dispatch } from 'redux'

import localForage from 'localforage'

export const saveSettings = createAction<Partial<Settings>>('SAVE_SETTINGS')

export const asyncLoadSettings = () => async (dispatch: Dispatch<Settings>) => {
  const settings = await localForage.getItem('settings') as Settings

  if (settings) {
    return dispatch(saveSettings(settings))
  }
}

export const asyncSaveSettings = (payload: Partial<Settings>) =>
  async (dispatch: Dispatch<Settings>, getState: () => State) => {
    const action = dispatch(saveSettings(payload))

    localForage.setItem('settings', getState().settings)
    return action
  }
