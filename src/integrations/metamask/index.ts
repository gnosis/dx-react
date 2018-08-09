// import { WALLET_PROVIDER } from 'globals'
import { WalletProvider } from '../types'
import Web3 from 'web3'

const Provider: WalletProvider = {
  get providerName() {
    if (!this.checkAvailability()) return null

    if (window.web3.currentProvider.isMetaMask) return 'METAMASK'

    return window.web3.currentProvider.constructor.name
  },
  priority: 90,
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
