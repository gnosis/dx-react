/** Wallet Integration - Replaces WalletIntegrationComponent
 * Called in ReactDOM.render(<comp>, <html>, CB?)
 */
import { registerProvider, updateProvider, initDutchX } from '../actions/blockchain'

import { Store } from 'redux'
import * as walletIntegrations from 'integrations/'

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

  const promisedInits = Object.keys(walletIntegrations)
    .map(intgr => walletIntegrations[intgr].initialize(providerOptions))

  try {
    await Promise.all(promisedInits)
  } catch (e) {

  } finally {
    dispatch(initDutchX())
  }
}
