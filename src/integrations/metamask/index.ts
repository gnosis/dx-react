import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
const Web3 = require('web3')

export default class Metamask extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.METAMASK

  /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote etherium host to be used as a last resort.
   */
  static providerPriority = 90

  constructor(...props: any[]) {
    super(...props)

    this.providerName = Metamask.providerName
  }

  static async initialize(runProviderFuncs: { [key: string]: Function }) {
    // const instance = super.initialize(runProviderRegister, runProviderUpdate) as Metamask

    const { registerProvider, updateProvider } = runProviderFuncs

    super.initialize(runProviderFuncs)

    registerProvider(Metamask.providerName, { priority: Metamask.providerPriority })

    // creates instance of Metamask class
    const instance = new this

    // Check if a Provider injected
    const providerState = await instance.getInitialState()
    return updateProvider(Metamask.providerName, providerState)
  }

  public async getInitialState() {
    // Check if a Provider injected
    try {
      if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider') {
        this.web3 = new Web3(window.web3.currentProvider)
        this.walletEnabled = true
      } else {
        this.walletEnabled = false
      }
    } catch (e) {
      this.walletEnabled = false
    }

    if (this.walletEnabled) {
      [this.network, this.account] = await Promise.all([
        this.getNetwork(),
        this.getAccount(),
      ])
    }

    return {
      available: this.walletEnabled && this.account !== null,
      network: this.network,
      account: this.account,
      // balance: this.balance,
    }
  }
}
