import { Component } from 'react'
// import { /* connectBlockchain,*/ initDutchXConnection } from 'api/dutchx'
// import { getSelectedProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'

const Web3 = require('web3')

interface WalletIntegrationProps {
  children: any,
  integrations: any,
  store: any
}

export default class WalletIntegrationProvider extends Component<WalletIntegrationProps, {}> {
  /**
   * Creates an instance of WalletIntegrationProvider.
   * @param {any} props 
   * @const {initializers} Takes <integrations> @prop typeof {Object} and returns VALUES into @const <initializers>
   * @memberof WalletIntegrationProvider
   */
  constructor(props: any) {
    super(props)
    const { integrations, store } = props
    const initializers = Object.keys(integrations).map(integrationName => integrations[integrationName])

    // Execute providers initialization sequentially
    const init = (funcs: any, reactStore?: any) => {
      if (funcs.length > 0) {
        return funcs[0].initialize(reactStore).then(
          () => init(funcs.slice(1), reactStore),
        )
      }
      // const selectedProvider = getSelectedProvider(reactStore.getState())
      // const opts = this.getDutchXOptions(selectedProvider)
      console.log(' ===> FIRING WalletIntegration.dispatch(initDutchX)')
      // reactStore.dispatch(initDutchXConnection(opts)) // .then(() => reactStore.dispatch(connectBlockchain()))

      return null
    }

    window.addEventListener('load', () => init(initializers, store))
  }

  getDutchXOptions(provider: any) {
    console.log('FIRING getDutchXOptions')
    const opts: any = {}

    if (provider && provider.name === WALLET_PROVIDER.METAMASK) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else if (provider && provider === WALLET_PROVIDER.PARITY) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else {
      // Default remote node
      opts.ethereum = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`)).currentProvider
    }

    return opts
  }

  render() {
    const { children } = this.props

    return children
  }
}
