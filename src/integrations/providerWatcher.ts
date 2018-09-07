import { WalletProvider } from 'integrations/types'
import { promisify, shallowDifferent } from 'utils'
import { Account, Balance } from 'types'
import { getTime } from 'api'
import { ETHEREUM_NETWORKS, networkById } from 'globals'

export const watcherLogger = ({ logType = 'log', status, info, updateState }: { logType: string, status: string, info: string, updateState: boolean }) =>
  console[logType](`
    Provider status:  ${status}
    Information:      ${info}
    Updating State:   ${updateState}
  `)

let prevTime: number

// Fired on setInterval every 10 seconds
const providerInitAndWatcher = async (provider: WalletProvider, { updateMainAppState, updateProvider, resetMainAppState }: any) => {

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
    // set block timestamp to provider state and compare
  try {
    if (!provider.checkAvailability() || (window.navigator && !window.navigator.onLine)) throw new Error('Provider and/or internet issues')
    provider.state.timestamp = prevTime

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
      updateProvider({ provider: provider.providerName, ...newState })
        // check if initial load or wallet locked

      if (!unlocked) {
        watcherLogger({
          logType: 'warn',
          status: 'WALLET LOCKED',
          info: 'Please unlock your wallet provider',
          updateState: false,
        })
          // if wallet locked, throw
        throw new Error('Wallet locked')
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
    // if error
    // connection lost or provider no longer returns data (locked/logged out)
    // reset all data associated with account
    resetMainAppState()

    if (provider.walletAvailable) {
        // disable internal provider
      provider.state.unlocked = false
        // and dispatch action with { available: false }
      updateProvider(provider)
    }
    throw err
  }
}

export default providerInitAndWatcher
