// import Transport from '@ledgerhq/hw-transport'
// import TransportU2F from '@ledgerhq/hw-transport-u2f'
// import createLedgerSubprovider from '@ledgerhq/web3-subprovider'
// import ProviderEngine from 'web3-provider-engine'
// import FetchSubprovider from 'web3-provider-engine/subproviders/fetch'
// import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js'
// import Eth from '@ledgerhq/hw-app-eth'

import { getTime } from 'api'
import { setupWeb3 } from 'api/web3Provider'

import { promisify } from 'utils'

import { Balance } from 'types'
import { WalletProvider } from 'integrations/types'

import { ETHEREUM_NETWORKS, networkById/* , network2RPCURL */ } from 'globals'

export const getAccount = async (provider: WalletProvider): Promise<Account> => {
  const [account] = await promisify(provider.web3.eth.getAccounts, provider.web3.eth)()

  return account
}

export const getNetwork = async (provider: WalletProvider, id?: boolean): Promise<ETHEREUM_NETWORKS> => {
  const networkId = await promisify(provider.web3.version.getNetwork, provider.web3.version)()

  return id ? networkId : networkById[networkId] || ETHEREUM_NETWORKS.UNKNOWN
}

export const getBalance = async (provider: WalletProvider, account: Account): Promise<Balance> => {
  const balance = await promisify(provider.web3.eth.getBalance, provider.web3.eth)(account)

  return provider.web3.fromWei(balance, 'ether').toString()
}

// get Provider state
export const grabProviderState = async (provider: WalletProvider) => {
  const [account, network, timestamp] = await Promise.all([
    getAccount(provider),
    getNetwork(provider),
    getTime(),
  ])

  const balance = account && await getBalance(provider, account)
  const available = provider.walletAvailable
  const unlocked = !!(available && account)
  const newState = { account, network, balance, available, unlocked, timestamp }

  return newState
}

// ====================================================================================
// Ledger Wallet info only
// const rpcUrl = network2RPCURL.RINKEBY
// const networkId = 4 // parseInt(process.env.REACT_APP_NETWORK_ID || "1337", 10);
// ====================================================================================

const Providers = {
  // runtime providers (METAMASK/MIST/PARITY)
  INJECTED_WALLET: {
    priority: 90,
    providerType: 'INJECTED_WALLET',
    keyName: 'INJECTED_WALLET',

    get providerName() {
      if (!this.checkAvailability()) return null

      if (window.mist && window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'MIST'
      if (window.web3.currentProvider.constructor.name === 'StatusHttpProvider') return 'STATUS'
      if (window.web3.currentProvider.constructor.name === 'o') return 'COINBASE'
      if (window.web3.currentProvider.isSafe) return 'GNOSIS SAFE'
      if ((window.web3.currentProvider || window.ethereum).isMetaMask) return 'METAMASK'

      return 'UNKNOWN PROVIDER'
    },

    checkAvailability() {
      if (this.web3) return this.walletAvailable = true
      return this.walletAvailable = (typeof window.web3 !== 'undefined' || typeof window.ethereum !== 'undefined') && (window.web3.currentProvider.constructor || window.ethereum.constructor)
    },

    async initialize() {
      if (!this.checkAvailability()) return
      this.web3 = await setupWeb3() // new Web3(window.web3.currentProvider)
      this.state = {}

      return this.web3
    },
  },
  // Hardware Provider - LEDGER
  /* LEDGER: {
    priority: 80,
    providerName: 'LEDGER',
    providerType: 'HARDWARE_WALLET',
    keyName: 'LEDGER',

    async checkAvailability() {
      if (this.ledger) return this.walletAvailable = true
      // return this.walletAvailable = !!(this.web3) && await promisify(this.ledger.getAccounts, this.ledger)
      return this.walletAvailable = true
    },

    async initialize() {
      try {
        const device = await (new Eth(await TransportU2F.create()))
        if (!device.getAppConfiguration()) throw 'Ledger not available'

        const engine = new ProviderEngine()
        const getTransport = async () => TransportU2F.create()
        const ledger = createLedgerSubprovider(getTransport, {
          networkId,
          accountsLength: 5,
        })

        engine.addProvider(ledger)
        engine.addProvider(new RpcSubprovider({ rpcUrl }))
        engine.addProvider(new FetchSubprovider({ rpcUrl }))
        engine.start()

        // set ETH App on ledger to provider object
        this.device = device
        this.web3 = new Web3(engine)
        this.state = {}

        console.log('​ETH Device', device)
        console.log('LEDGER WEB3: ', this.web3)
        this.device.transport.on('disconnect', (err: Error) => err ? console.error(err) : console.log('LEDGER DISCONNECT DETECTED'))
        return this.web3
      } catch (error) {
        console.error(error)
        this.walletAvailable = false
        throw new Error(error)
      }
    },
  }, */
}

export default Providers
