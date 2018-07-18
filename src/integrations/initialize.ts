import { promisify } from 'api/utils'
import { getTime } from 'api'
import { ETHEREUM_NETWORKS } from './constants'
import { WalletProvider, ConnectedInterface } from './types'
import { Account, Balance } from 'types'

import MetamaskProvider from './metamask'
// import ParityProvider from './parity'
// import RemoteProvider from './remote'

export const WATCHER_INTERVAL = 5000

const networkById = {
  1: ETHEREUM_NETWORKS.MAIN,
  2: ETHEREUM_NETWORKS.MORDEN,
  3: ETHEREUM_NETWORKS.ROPSTEN,
  4: ETHEREUM_NETWORKS.RINKEBY,
  42: ETHEREUM_NETWORKS.KOVAN,
}

const providers: WalletProvider[] = [
  MetamaskProvider,
  // ParityProvider,
  // RemoteProvider,
]

// compare object properties
const shallowDifferent = (obj1: object, obj2: object) => {
  if (!obj1 || !obj2) return true

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return true

  return keys1.some(key => obj1[key] !== obj2[key])
}

const watcherLogger = ({ logType = 'log', status, info, updateState }: { logType: string, status: string, info: string, updateState: boolean }) =>
  console[logType](`
    Provider status:  ${status}
    Information:      ${info}
    Updating State:   ${updateState}
  `)

// Fired from WalletIntegrations as part of the React mounting CB in src/index.ts
export default async ({ registerProvider, updateProvider, updateMainAppState, resetMainAppState, initDutchX }: ConnectedInterface | any) => {
  let prevTime: number
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

  // Fired on setInterval every 10 seconds
  const watcher = async (provider: WalletProvider, init?: string | boolean) => {
    if (!provider.checkAvailability()) return

    // set block timestamp to provider state and compare
    provider.state.timestamp = prevTime
    try {
      const [account, network, timestamp] = await Promise.all<Account, ETHEREUM_NETWORKS, number>([
          getAccount(provider),
          getNetwork(provider),
          getTime(),
        ]),
        balance = account && await getBalance(provider, account),
        available = provider.walletAvailable,
        unlocked = !!(available && account),
        newState = { account, network, balance, available, unlocked, timestamp }

        // if data changed
      if (shallowDifferent(provider.state, newState)) {
        console.log('app state is different')
        console.log('was: ', newState)
        console.log('now: ', provider.state)

        // reset module timestamp with updated timestamp
        prevTime = timestamp
        // dispatch action with updated provider state
        updateProvider(provider.providerName, provider.state = newState)
        // check if initial load or wallet locked

        if (init && unlocked) {
          watcherLogger({
            logType: 'warn',
            status: 'INITIALISING',
            info: 'Setting up Web3 provider',
            updateState: false,
          })
          await initDutchX()
          await updateMainAppState()
        }
        else if (!unlocked) {
          watcherLogger({
            logType: 'warn',
            status: 'WALLET LOCKED',
            info: 'Please unlock your wallet provider',
            updateState: false,
          })
          // if error
          // connection lost or provider no longer returns data (locked/logged out)
          // reset all data associated with account
          throw 'Wallet locked during polling'
        }
        else {
          watcherLogger({
            logType: 'warn',
            status: 'CONNECTED + WALLET UNLOCKED',
            info: 'Web3 provider connected + wallet unlocked',
            updateState: true,
          })
          await updateMainAppState()
        }
      }
    } catch (err) {
      console.warn(err)
      // if error
      // connection lost or provider no longer returns data (locked/logged out)
      // reset all data associated with account
      resetMainAppState()

      if (provider.walletAvailable) {
        // disable internal provider
        provider.state.unlocked = false
        // and dispatch action with { available: false }
        updateProvider(provider.providerName, provider.state)
      }
    }
  }

  providers.forEach((provider) => {
    // each provider intializes by creating its own web3 instance if there is a corresponding currentProvider injected
    provider.initialize()
    if (!provider.walletAvailable) return
    // dispatch action to save provider name and priority
    registerProvider(provider.providerName, { priority: provider.priority })
    // get account, balance, etc. PROVIDER state - do not update main app state yet
    watcher(provider, 'INIT')
    // regularly refetch state
    setInterval(() => watcher(provider), WATCHER_INTERVAL)
  })
}
