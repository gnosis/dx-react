import { WALLET_PROVIDER } from 'integrations/constants'
import { registerProvider, updateProvider } from 'actions/blockchain'
import InjectedWeb3 from 'integrations/injectedWeb3'
import Web3 from 'web3'

class Metamask extends InjectedWeb3 {
  async initialize(store) {
    this.store = store
    this.store.dispatch(registerProvider({ provider: WALLET_PROVIDER.METAMASK }))
    let walletEnabled
    if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider') {
      this.web3 = new Web3(window.web3.currentProvider)
      walletEnabled = true
    } else {
      walletEnabled = false
    }

    let network
    let account

    if (walletEnabled) {
      network = await this.getNetwork()
      account = await this.getAccount()
    }

    return await this.store.dispatch(updateProvider({
      provider: WALLET_PROVIDER.METAMASK,
      available: walletEnabled && account !== undefined,
      network,
      account,
    }))
  }


}

export default new Metamask()
