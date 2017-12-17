import { promisify } from 'api/utils'
import { ETHEREUM_NETWORKS, WALLET_PROVIDER } from './constants'
import { Account, Balance } from 'types'
import Web3 from 'web3'

const WATCHER_INTERVAL = 10000

const networkById = {
  1: ETHEREUM_NETWORKS.MAIN,
  2: ETHEREUM_NETWORKS.MORDEN,
  3: ETHEREUM_NETWORKS.ROPSTEN,
  4: ETHEREUM_NETWORKS.RINKEBY,
  42: ETHEREUM_NETWORKS.KOVAN,
}

interface ProviderState {
  account: Account,
  network: ETHEREUM_NETWORKS,
  balance: Balance,
  available: boolean,
}

interface WalletProvider {
  providerName: WALLET_PROVIDER,
  priority: number,
  walletAvailable?: boolean,
  checkAvailability(): boolean,
  initialize(): void,
  state?: ProviderState,
  web3?: any,
}


const providers: WalletProvider[] = [
  {
    providerName: WALLET_PROVIDER.METAMASK,
    priority: 90,
    checkAvailability() {
      if (this.web3) return this.walletAvailable = this.web3.isConnected()
      return this.walletAvailable = typeof window.web3 !== 'undefined'
        && window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider'
    },
    initialize() {
      if (!this.checkAvailability()) return
      this.web3 = new Web3(window.web3.currentProvider)
      this.state = {}
    },
  },
  {
    providerName: WALLET_PROVIDER.PARITY,
    priority: 50,
    checkAvailability() {
      if (this.web3) return this.walletAvailable = this.web3.isConnected()
      return this.walletEnabled = typeof window.web3 !== 'undefined' && window.web3.parity
    },
    initialize() {
      if (!this.checkAvailability()) return
      this.web3 = new Web3(window.web3.currentProvider)
      this.state = {}
    },
  },
  {
    providerName: WALLET_PROVIDER.REMOTE,
    priority: 1,
    checkAvailability() {
      if (this.web3) return this.walletAvailable = this.web3.isConnected()
      return this.walletEnabled = typeof window.web3 !== 'undefined'
    },
    initialize() {
      if (!this.checkAvailability()) return
      this.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))
      this.state = {}
    },
  },
]


const shallowDifferent = (obj1: object, obj2: object) => {
  if (!obj1 || !obj2) return true

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return true

  return keys1.some(key => obj1[key] !== obj2[key])
}

type ConnectedInterface = { registerProvider: Function, updateProvider: Function }

export const initialize = async ({ registerProvider, updateProvider }: ConnectedInterface) => {

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

  const watcher = async (provider: WalletProvider) => {
    if (!provider.checkAvailability()) return

    try {
      const [account, network] = await Promise.all([
        getAccount(provider),
        getNetwork(provider),
      ])

      const balance = await getBalance(provider, account)

      const available = !!(provider.walletAvailable && account)


      const newState = { account, network, balance, available }

      // if data changed
      if (shallowDifferent(provider.state, newState)) {
        updateProvider(provider.providerName, provider.state = newState)
      }
    } catch (err) {
      console.warn(err)
      if (provider.walletAvailable) {
        provider.state.available = false
        updateProvider(provider.providerName, provider.state)
      }
    }
  }

  providers.forEach((provider) => {
    provider.initialize()
    registerProvider(provider.providerName, { priority: provider.priority })
    watcher(provider)
    setInterval(() => watcher(provider), WATCHER_INTERVAL)
  })
}
