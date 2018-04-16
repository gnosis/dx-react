import localForage from 'localforage'
import { Store } from 'redux'

import initialize from './initialize'
import { registerProvider, updateProvider, initDutchX, updateMainAppState } from 'actions/blockchain'

import tokensMap from 'api/apiTesting'
import { setDefaultTokenList } from 'actions'
import { DefaultTokens } from 'api/types'

export default async function walletIntegration(store: Store<any>) {
  const { dispatch, getState } = store
  // wraps actionCreator in dispatch
  const dispatchProviderAction = (actionCreator: any) =>
    async (provider: any, data: any) => dispatch(actionCreator({
      provider,
      ...data,
    }))

  const providerOptions = {
    getState,
    updateProvider: dispatchProviderAction(updateProvider),
    registerProvider: dispatchProviderAction(registerProvider),
    updateMainAppState: dispatchProviderAction(updateMainAppState),
  }

  const getDefaultTokens = async () => {
    let defaultTokens = await localForage.getItem('defaultTokens') as DefaultTokens
    const isDefaultTokensAvailable = !!(defaultTokens)

    // IF (!defJSONObj in localForage) return anxo/api/v1/defaultTokens.json
    // ELSE localForage.getItem('defaultTokens')
    if (!isDefaultTokensAvailable) {
      // grab tokens from API
      // TODO: Reinstate line 32 when API is setup
      // const defaultTokens = await fetch('https://dx-services.staging.gnosisdev.com/api/v1/markets').then(res => res.json())
      defaultTokens = await tokensMap()
      // set tokens to localForage
      await localForage.setItem('defaultTokens', defaultTokens)
    }
    return dispatch(setDefaultTokenList({ defaultTokenList: defaultTokens.elements }))
  }


  try {
    await getDefaultTokens()
    await initialize(providerOptions)
  } catch (error) {
    console.warn('Error initializing wallet providers:', error.message || error)
  } finally {
    dispatch(initDutchX())
  }
}
