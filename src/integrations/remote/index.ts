import { WALLET_PROVIDER } from '../constants'
import { WalletProvider } from '../types'
import Web3 from 'web3'

const RemoteProvider: WalletProvider = {
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
}

export default RemoteProvider
