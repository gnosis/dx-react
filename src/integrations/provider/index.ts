import Web3 from 'web3'
// import Transport from '@ledgerhq/hw-transport'
// import TransportU2F from '@ledgerhq/hw-transport-u2f'
// import createLedgerSubprovider from '@ledgerhq/web3-subprovider'
// @ts-ignore
import ProviderEngine from 'web3-provider-engine'
// @ts-ignore
import FetchSubprovider from 'web3-provider-engine/subproviders/fetch'
// @ts-ignore
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js'
// import Eth from '@ledgerhq/hw-app-eth'

import { getTime } from 'api'

import { promisify } from 'utils'

import { Balance } from 'types'
import { WalletProvider } from 'integrations/types'

import { ETHEREUM_NETWORKS, networkById, network2RPCURL } from 'globals'

import { store } from 'components/App'
import { openModal } from 'actions'

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
const rpcUrl = network2RPCURL.UNKNOWN
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

      if (window.web3.currentProvider.constructor.name === 'Web3ProviderEngine') return 'GNOSIS SAFE'
      if (window.web3.currentProvider.isMetaMask) return 'METAMASK'
      if ((window as any).mist && window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'MIST'
      if (window.web3.currentProvider.constructor.name === 'StatusHttpProvider') return 'STATUS'

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
  // Private Key Wallet
  PRIVATE_KEY_WALLET: {
    priority: 1,
    providerName: 'Private Key Wallet',
    providerType: 'PRIVATE_KEY_WALLET',
    keyName: 'PRIVATE_KEY_WALLET',

    checkAvailability() {
      return this.walletAvailable = true
    },

    initialize(privateKey: string = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d') {
      if (!this.checkAvailability()) return

      const walletSetup = require('ethereumjs-wallet')
      const ethUtils = require('ethereumjs-util')
      const WalletSubprovider = require('ethereumjs-wallet/provider-engine')
      const privKey = ethUtils.toBuffer(privateKey)
      const wallet = walletSetup.fromPrivateKey(privKey)
      const engine = new ProviderEngine()

      const customWalletSubprovider = new WalletSubprovider(wallet)
      customWalletSubprovider.validateTransaction = async function (txParams: any, cb: Function) {
        console.log('TCL: initialize -> txParams', txParams)
        try {
          // here, instead of prompt, use a modal and txParams to populate and show
          // users what the fuuuuuck theyre signing, ayy
          const promisedChoice: Promise<string> = new Promise(accept => {
            store.dispatch(openModal({
              modalName: 'ApprovalModal',
              modalProps: {
                header: 'Private Key Transaction Confirmation',
                body: `A blockchain transaction was detected. Please review transaction params below and confirm or cancel.
                Transaction Parameters:
                From: ${txParams.from}
                To: ${txParams.to}
                `,
                buttons: {
                  button2: {
                    buttonTitle2: 'Confirm',
                  },
                  button1: {
                    buttonTitle1: 'Cancel',
                  },
                },
                onClick: accept,
              },
            }))
          })
          const choice = await promisedChoice

          if (choice === 'MIN') throw new Error('User cancelled transaction.')
          else return cb()
        } catch (error) {
          console.error(error)
          throw error
        }
      }
      engine.addProvider(customWalletSubprovider)
      engine.addProvider(new RpcSubprovider({ rpcUrl }))
      engine.addProvider(new FetchSubprovider({ rpcUrl }))
      engine.start()

      this.web3 = new Web3(engine)

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
