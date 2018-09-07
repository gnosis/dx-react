// import { WALLET_PROVIDER } from 'globals'
import { WalletProvider } from '../types'
import Web3 from 'web3'

const Provider: WalletProvider = {
  priority: 90,

  get providerName() {
    if (!this.checkAvailability()) return null

    if (window.web3.currentProvider.isMetaMask) return 'METAMASK'
    if ((window as any).mist && window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'MIST'

    return window.web3.currentProvider.constructor.name
  },

  checkAvailability() {
    if (this.web3) return this.walletAvailable = this.web3.isConnected()
    return this.walletAvailable = typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor
  },

  initialize() {
    if (!this.checkAvailability()) return
    this.web3 = new Web3(window.web3.currentProvider)
    this.state = {}
  },
}

export default Provider
