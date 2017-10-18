/** Wallet Integration - Replaces WalletIntegrationComponent
 * Called in ReactDOM.render(<comp>, <html>, CB?)
 */
// import autobind from 'autobind-decorator'
import { registerProvider, updateProvider, initDutchX } from '../actions/blockchain'
// import { map } from 'lodash'

// declare global object
declare global {
  interface Window { web3: any }
}

window.web3 = window.web3 || {}

export default class WalletIntegrationProvider {
  store: any
  /**
   * Creates an instance of WalletIntegrationProvider.
   * @param {any} integrations 
   * @param {any} store
   * @const {initializers} Takes <integrations> @prop typeof {Object} and returns VALUES into @const <initializers>
   * @memberof WalletIntegrationProvider
   */
  constructor(integrations: any, store: any) {
    this.store = store
    this.handleProviderUpdate = this.handleProviderUpdate.bind(this)
    this.handleProviderRegister = this.handleProviderRegister.bind(this)

    const providerOptions = {
      runProviderUpdate: this.handleProviderUpdate,
      runProviderRegister: this.handleProviderRegister,
    }

    // Execute providers initialization sequentially
    window.addEventListener('load', () => {
        console.log('Window LOADED')
        Promise.resolve(integrations.Metamask.initialize(providerOptions))
        //Promise.all(map(integrations, (integration: any) => integration.initialize(providerOptions)))
        //THEN initialise DutchX contracts and class Instance
        .then(() => store.dispatch(initDutchX()))
        .catch(() => store.dispatch(initDutchX()))
    })
  }

  // Fired by PROVIDER (e.g METAMASK) => DISPATCHES Action w/ Provider NAME && Provider DATA
  async handleProviderUpdate(provider: any, data: any) {
    await this.store.dispatch(updateProvider({
      provider: provider.constructor.providerName, 
      ...data,
    }))
  }

  // Fired by PROVIDER (e.g METAMASK) => DISPATCHES Action w/ Provider NAME && Provider DATA
  async handleProviderRegister(provider: any, data: any) {
    await this.store.dispatch((registerProvider({
      provider: provider.constructor.providerName,
      ...data,
    })))
  }
}
