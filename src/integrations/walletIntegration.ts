import { Store, Dispatch } from 'redux'

import {
  registerProvider,
  updateProvider,
} from 'actions'

import { State, Balance } from 'types'
import { ETHEREUM_NETWORKS } from './constants'
import MetamaskProvider from './metamask'
import { WalletProvider } from 'integrations/types'
import { networkById } from 'integrations/initialize'
import { promisify } from 'api/utils'
import { getTime } from 'api'
import { timeoutCondition } from 'utils/helpers'
// import { IPFS_TOKENS_HASH } from 'globals'

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
    updateProvider: dispatchProviderAction(updateProvider),
  }

  const getAccount = async (provider: WalletProvider): Promise<Account> => {
    const [account] = await promisify(provider.web3.eth.getAccounts, provider.web3.eth)()

    return account
  }

  const getNetwork = async (provider: WalletProvider): Promise<ETHEREUM_NETWORKS> => {
    const networkId = await promisify(provider.web3.version.getNetwork, provider.web3.version)()
    return networkById[networkId] || ETHEREUM_NETWORKS.UNKNOWN
  }

  const getBalance = async (provider: WalletProvider, account: Account): Promise<Balance> => {

    const balance = await promisify(provider.web3.eth.getBalance, provider.web3.eth)(account)

    return provider.web3.fromWei(balance, 'ether').toString()
  }

  // get Provider state
  const grabProviderState = async (provider: WalletProvider) => {
    const promisedState = await Promise.race<[Account, ETHEREUM_NETWORKS, number] | {}>([
      Promise.all([
        getAccount(provider),
        getNetwork(provider),
        getTime(),
      ]),
      timeoutCondition(8000, 'Provider setup timeout. Please check that you are properly logged in and that your network choice is correct.'),
    ])

    const [account, network, timestamp] = promisedState as [Account, ETHEREUM_NETWORKS, number],
      balance = account && await getBalance(provider, account),
      available = provider.walletAvailable,
      unlocked = !!(available && account),
      newState = { account, network, balance, available, unlocked, timestamp }

    return newState
  }

  try {
    const provider = MetamaskProvider

    provider.initialize()

    // dispatch action to save provider name and priority
    dispatchers.regProvider(provider.providerName, { priority: provider.priority })

    const newState = await grabProviderState(provider)

    dispatchers.updateProvider(provider.providerName, { ...newState })
  } catch (error) {
    console.error(error.message || error)
  }
}
