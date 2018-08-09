import { WALLET_PROVIDER } from 'globals'
import { WalletProvider } from '../types'
import Web3 from 'web3'

const MetamaskProvider: WalletProvider = {
  providerName: WALLET_PROVIDER.METAMASK,
  priority: 90,
  checkAvailability() {
    if (this.web3) return this.walletAvailable = this.web3.isConnected()
    return this.walletAvailable = typeof window.web3 !== 'undefined'
      && (window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider' || window.web3.currentProvider.isMetaMask)
  },
  initialize() {
    if (!this.checkAvailability()) return
    this.web3 = new Web3(window.web3.currentProvider)
    this.state = {}
  },
}

export default MetamaskProvider
