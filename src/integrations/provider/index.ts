import Web3 from 'web3'
// import Transport from '@ledgerhq/hw-transport'
// import TransportU2F from '@ledgerhq/hw-transport-u2f'
// import createLedgerSubprovider from '@ledgerhq/web3-subprovider'
// import ProviderEngine from 'web3-provider-engine'
// import FetchSubprovider from 'web3-provider-engine/subproviders/fetch'
// import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js'
// import Eth from '@ledgerhq/hw-app-eth'
// @ts-ignore
import WalletConnect from 'walletconnect'
// @ts-ignore
import WalletConnectQRCodeModal from 'walletconnect-qrcode-modal'
// @ts-ignore
import WalletConnectProvider from 'walletconnect-web3-provider'

import { getTime } from 'api'

import { promisify } from 'utils'

import { Balance } from 'types'
import { WalletProvider } from 'integrations/types'

import { ETHEREUM_NETWORKS, networkById, /* , network2RPCURL */
COMPANY_NAME} from 'globals'

export const getAccount = async (provider: WalletProvider): Promise<Account> => {
  const [account] = await promisify(provider.web3.eth.getAccounts, provider.web3.eth)()

  return account
}

export const getNetwork = async (provider: WalletProvider): Promise<ETHEREUM_NETWORKS> => {
  const networkId = await promisify(provider.web3.version.getNetwork, provider.web3.version)()

  return networkById[networkId] || ETHEREUM_NETWORKS.UNKNOWN
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

      if ((window as any).mist && window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'MIST'
      if (window.web3.currentProvider.constructor.name === 'StatusHttpProvider') return 'STATUS'
      if (window.web3.currentProvider.constructor.name === 'o') return 'COINBASE'
      if (window.web3.currentProvider.isSafe) return 'GNOSIS SAFE'
      if (window.web3.currentProvider.isMetaMask) return 'METAMASK'

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
  // WalletConnect
  WALLETCONNECT: {
    priority: 80,
    providerName: 'WALLET CONNECT',
    providerType: 'SDK_WALLET',
    keyName: 'WALLETCONNECT',
    initiated: false,

    async checkAvailability() {
      if (this.session) return this.walletAvailable = true
      return this.walletAvailable = true
    },

    async initialize(networkURL: string = 'https://rinkeby.infura.io/') {
      try {
        // @ts-ignore
        // const WalletConnectProvider = await import('walletconnect-web3-provider')

        /**
         *  Create WalletConnect Provider
         */
        const walletConnectProvider = new WalletConnectProvider({
          bridgeUrl: 'https://test-bridge.walletconnect.org',   // Required
          dappName: COMPANY_NAME,                               // Required
          rpcUrl: networkURL,                                    // Required
        })
        console.debug('TCL: asyncinitialize -> provider', walletConnectProvider)

        /**
         *  Create Web3
         */
        this.web3 = new Web3(walletConnectProvider)

        /**
         *  Initiate WalletConnect Session
         */
        this.session = await walletConnectProvider.walletconnect.initSession()

        // check Connection Status
        if (!this.initiated && !walletConnectProvider.isConnected) {
          const { uri } = walletConnectProvider.walletconnect

          // TODO: show QR code to user here via uri const
          WalletConnectQRCodeModal.open(uri)

          await walletConnectProvider.walletconnect.listenSessionStatus()
          // wait for confirmation
          // await Promise.race([
          //   walletConnectProvider.walletconnect.listenSessionStatus(),
          //   timeoutCondition(60000, 'WalletConnect timeout. Please refresh and try again.')
          // ])

          WalletConnectQRCodeModal.close()

          this.initiated = true
          console.debug('INITIATED. ACCTS = ', await this.web3.eth.getAccounts((_: null, res: any) => console.debug(res)))
        }

        this.state = {}
        return this.web3
      } catch (error) {
        console.error(error)
        // WalletConnectQRCodeModal.close()

        this.walletAvailable = false
        throw new Error(error)
      }
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
