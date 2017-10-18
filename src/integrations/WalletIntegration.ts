/** Wallet Integration - Replaces WalletIntegrationComponent
 * Called in ReactDOM.render(<comp>, <html>, CB?)
 */
import autobind from 'autobind-decorator'
import { registerProvider, updateProvider, initDutchX } from 'actions/blockchain'

// declare global object
declare global {
  interface Window { web3: any }
}

window.web3 = window.web3 || {}

export default class WalletIntegrationProvider {
  /**
   * Creates an instance of WalletIntegrationProvider.
   * @param {any} integrations 
   * @param {any} store
   * @const {initializers} Takes <integrations> @prop typeof {Object} and returns VALUES into @const <initializers>
   * @memberof WalletIntegrationProvider
   */
  constructor(integrations: Object) {

    const providerOptions = {
      runProviderUpdate: this.handleProviderUpdate,
      runProviderRegister: this.handleProviderRegister,
    }

    // Execute providers initialization sequentially
    window.addEventListener('load', () => {
        Promise.all(Object.keys(integrations).map(provider => integrations[provider].initialise(providerOptions)))
        //THEN initialise DutchX contracts and class Instance
        .then(initDutchX)
        .catch(initDutchX)
    })
  }

  // Fired by PROVIDER (e.g METAMASK) => DISPATCHES Action w/ Provider NAME && Provider DATA
  @autobind
  async handleProviderUpdate(provider: any, data: any) {
    await updateProvider({
      provider: provider.constructor.providerName, 
      ...data,
    })
  }

  // Fired by PROVIDER (e.g METAMASK) => DISPATCHES Action w/ Provider NAME && Provider DATA
  @autobind
  async handleProviderRegister(provider: any, data: any) {
    await registerProvider({
      provider: provider.constructor.providerName,
      ...data,
    })
  }
}
