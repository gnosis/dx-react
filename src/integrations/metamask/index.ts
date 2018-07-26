import { WALLET_PROVIDER } from '../constants'
import { WalletProvider } from '../types'
import Web3 from 'web3'
import { RINKEBY_WEBSOCKET } from 'globals'

const MetamaskProvider: WalletProvider = {
  providerName: WALLET_PROVIDER.METAMASK,
  priority: 90,
  checkAvailability() {
    if (this.web3) return this.walletAvailable = this.web3.eth.net.isListening()

    return this.walletAvailable = typeof window.web3 !== 'undefined'
      && (window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider' || window.web3.currentProvider.isMetaMask)
  },
  initialize(ws?: string) {
    if (!this.checkAvailability()) return
    this.web3 = ws ? new Web3(RINKEBY_WEBSOCKET) : new Web3(window.web3.currentProvider)
    console.log('MetaMaskProvider Init -> this.web3 = ', this.web3)

    this.state = {}
  },
}

export default MetamaskProvider
