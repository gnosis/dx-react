import { WALLET_PROVIDER } from 'globals'
import { WalletProvider } from '../types'
import Web3 from 'web3'

const ParityProvider: WalletProvider = {
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
}

export default ParityProvider
