import { registerProvider, updateProvider, initDutchX, setApprovedTokens } from '../actions'
import initialize from './initialize'

import { Store } from 'redux'

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
  }

  // TODO: fetch approvedTokens list from api
  // then after getting tokensJSON in getDefaultTokens create a list of approved TokenCodes
  // then only dispatch that list
  dispatch(setApprovedTokens(['ETH', 'GNO']))

  try {
    await initialize(providerOptions)
  } catch (error) {
    console.warn('Error initializing wallet providers:', error.message || error)
  } finally {
    dispatch(initDutchX())
  }
}
