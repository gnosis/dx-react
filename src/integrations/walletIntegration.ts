import { Store, Dispatch } from 'redux'
import { registerProvider } from 'actions'
import Providers from 'integrations/provider'
import { State } from 'types'
import { WalletProvider } from './types'

export default async function walletIntegration(store: Store<any>) {
  const { dispatch }: { dispatch: Dispatch<any>, getState: () => State } = store
  // wraps actionCreator in dispatch
  const dispatchProviderAction = (actionCreator: any) =>
    async (provider: any, data: any) => dispatch(actionCreator({
      provider,
      ...data,
    }))

  const dispatchers = {
    regProvider: dispatchProviderAction(registerProvider),
  }

  Object.keys(Providers).forEach((providerKey) => {
    const provider: WalletProvider = Providers[providerKey]

    provider.checkAvailability()

    // check availability
    if (!provider.walletAvailable) return
    // dispatch action to save provider name and priority
    return dispatchers.regProvider(
      providerKey,
      {
        name: provider.providerName,
        type: provider.providerType,
        keyName: provider.keyName,
        priority: provider.priority,
      })
  })
}
