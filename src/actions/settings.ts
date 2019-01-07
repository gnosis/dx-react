import { createAction } from 'redux-actions'
import { Settings, CookieSettings } from 'types'
import { Dispatch } from 'redux'
import localForage from 'localforage'

import { web3CompatibleNetwork } from 'utils'

export const saveSettings = createAction<Partial<Settings | CookieSettings>>('SAVE_SETTINGS')

export const asyncLoadSettings = () => async (dispatch: Dispatch<any>) => {
  const [network, disclaimerSettings, cookieSettings] = await Promise.all<string, Settings, CookieSettings>([
    web3CompatibleNetwork(),
    localForage.getItem('settings'),
    localForage.getItem('cookieSettings'),
  ])

  if (disclaimerSettings) {
    // check disclaimer settings for networks accepted
    const { networks_accepted } = disclaimerSettings
    // if user currently using MAIN
    // check if networksAccepted includes MAIN or not
    if (network && !networks_accepted[network]) {
      // set disclaimer_accepted to false to reprompt verification
      disclaimerSettings.disclaimer_accepted = false
      // set it locally in forage
      await localForage.setItem('settings', { ...disclaimerSettings, disclaimer_accepted: false })
    }
  }
  const settings = [disclaimerSettings, cookieSettings]
  // save in redux store
  return settings.forEach(setting => dispatch(saveSettings(setting)))
}

export const asyncSaveSettings = (payload: Partial<Settings>) =>
  async (dispatch: Dispatch<any>) => {
    const action = dispatch(saveSettings(payload))
    // const { settings: { disclaimer_accepted, networks_accepted, analytics, cookies } } = getState()
    localForage.setItem('settings', payload)
    return action
  }
