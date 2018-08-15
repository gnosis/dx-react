// import { WALLET_PROVIDER } from 'globals'
// import { WalletProvider } from '../types'
import Web3 from 'web3'
// @ts-ignore
import TransportU2F from '@ledgerhq/hw-transport-u2f'
// @ts-ignore
import createLedgerSubprovider from '@ledgerhq/web3-subprovider'
import ProviderEngine from 'web3-provider-engine'
// @ts-ignore
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch'
// @ts-ignore
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js'

const rpcUrl = 'http://127.0.0.1:8545'

const Providers = {
  // runtime providers (METAMASK/MIST/PARITY)
  INJECTED_WALLET: {
    priority: 90,
    providerType: 'INJECTED_WALLET',

    get providerName() {
      if (!this.checkAvailability()) return null

      if (window.web3.currentProvider.isMetaMask) return 'METAMASK'
      if ((window as any).mist && window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'MIST'

      return window.web3.currentProvider.constructor.name
    },

    checkAvailability() {
      if (this.web3) return this.walletAvailable = true
      return this.walletAvailable = typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor
    },

    initialize() {
      if (!this.checkAvailability()) return
      this.web3 = new Web3(window.web3.currentProvider)
      this.state = {}

      return this.web3
    },
  },
  // Hardware Provider - LEDGER
  LEDGER: {
    priority: 80,
    providerName: 'LEDGER',
    providerType: 'HARDWARE_WALLET',

    checkAvailability() {
      if (this.web3) return this.walletAvailable = !!(this.web3.currentProvider)
      return this.walletAvailable = true
    },

    async initialize() {
      if (!this.checkAvailability()) return

      const engine = new ProviderEngine()
      const getTransport = () => TransportU2F.create()
      const ledger = createLedgerSubprovider(getTransport, {
        networkId: '4',
        accountsLength: 5,
      })

      engine.addProvider(ledger)
      engine.addProvider(new RpcSubprovider({ rpcUrl }))
      engine.start()

      this.web3 = new Web3(engine)
      this.state = {}

      return this.web3
    },
  },
}

export default Providers
