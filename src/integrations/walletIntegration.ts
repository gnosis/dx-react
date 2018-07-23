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
import { getTime } from 'api'
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
    const [account] = await provider.web3.eth.getAccounts()

    return account
  }

  const getNetwork = async (provider: WalletProvider): Promise<ETHEREUM_NETWORKS> => {
    const networkId = await provider.web3.eth.net.getId()
    return networkById[networkId] || ETHEREUM_NETWORKS.UNKNOWN
  }

  const getBalance = async (provider: WalletProvider, account: Account): Promise<Balance> => {

    const balance = await provider.web3.eth.getBalance(account)

    return provider.web3.utils.fromWei(balance, 'ether').toString()
  }

  // get Provider state
  const grabProviderState = async (provider: WalletProvider) => {
    const [account, network, timestamp] = await Promise.all<Account, ETHEREUM_NETWORKS, number>([
        getAccount(provider),
        getNetwork(provider),
        getTime(),
      ]),
      balance = account && await getBalance(provider, account),
      available = provider.walletAvailable,
      unlocked = !!(available && account),
      newState = { account, network, balance, available, unlocked, timestamp }

    return newState
  }

  try {
    const provider = MetamaskProvider

    provider.initialize('Websocket')
    // dispatch action to save provider name and priority
    dispatchers.regProvider(provider.providerName, { priority: provider.priority })

    const newState = await grabProviderState(provider)

    dispatchers.updateProvider(provider.providerName, { ...newState })
  } catch (error) {
    // console.warn(error.message || error)
    throw error
  }
}

/* export default async function walletIntegration(store: Store<any>) {
  const { dispatch, getState }: { dispatch: Dispatch<any>, getState: () => State } = store
  // wraps actionCreator in dispatch
  const dispatchProviderAction = (actionCreator: any) =>
    async (provider: any, data: any) => dispatch(actionCreator({
      provider,
      ...data,
  const providerOptions: ConnectedInterface = {
    getState,
    initDutchX: dispatchProviderAction(initDutchX),
  }

  try {
    // init Provider first - set a watcher for 6000 ms to check changes
    await initialize(providerOptions)

    const { combinedTokenList } = await dispatch(getTokenList())

    // TODO: fetch approvedTokens list from api
    // then after getting tokensJSON in getDefaultTokens create a list of approved TokenCodes
    // then only dispatch that list
    // const [ETH, GNO] = defaultTokenList
    // dispatch(setApprovedTokens([ETH.address, GNO.address]))

    const [approvedTokenAddresses, availableAuctions] = await Promise.all([
      getApprovedTokensFromAllTokens(combinedTokenList),
      getAvailableAuctionsFromAllTokens(combinedTokenList),
    ])
    dispatch(setApprovedTokens(approvedTokenAddresses))
    dispatch(setAvailableAuctions(availableAuctions))

    // await dispatch(initDutchX())
    // set state in app
    // return dispatch(updateMainAppState())
  } catch (error) {
    console.warn(error.message || error)
  }
} */
