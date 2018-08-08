import { WalletProvider } from 'integrations/types'
import { ETHEREUM_NETWORKS } from 'integrations/constants'
import { Account, Balance } from 'types'
import { getTime } from 'api'
import { shallowDifferent } from 'utils/helpers'
import { networkById } from 'integrations/initialize'

export const watcherLogger = ({ logType = 'log', status, info, updateState }: { logType: string, status: string, info: string, updateState: boolean }) =>
  console[logType](`
    Provider status:  ${status}
    Information:      ${info}
    Updating State:   ${updateState}
  `)

let prevTime: number

// Fired on setInterval every 10 seconds
const watcher = async (provider: WalletProvider, { updateMainAppState, updateProvider, resetMainAppState }: any) => {

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
        updateProvider({ provider })
      }
  }
}

export default watcher
