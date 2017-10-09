import { Component } from 'react'
import PropTypes from 'prop-types'
import { connectBlockchain, initGnosis } from 'actions/blockchain'
import { getSelectedProvider } from 'selectors/blockchain'
import { WALLET_PROVIDER } from 'integrations/constants'
import Web3 from 'web3'


export default class WalletIntegrationProvider extends Component {

  constructor(props) {
    super(props)
    const { integrations, store } = props
    const initializers = Object.keys(integrations).map(integrationName => integrations[integrationName])


    // Execute providers inizialization sequentially
    const init = (funcs, reactStore) => {
      if (funcs.length > 0) {
        return funcs[0].initialize(reactStore).then(
          () => init(funcs.slice(1), reactStore),
        )
      }
      // Gnosis initialization needed after providers init
      // Get selected provider
      const selectedProvider = getSelectedProvider(reactStore.getState())
      // get Gnosis options
      const opts = this.getGnosisOptions(selectedProvider)
      // init Gnosis connection
      reactStore.dispatch(initGnosis(opts)).then(() => reactStore.dispatch(connectBlockchain()))
      return null
    }

    window.addEventListener('load', () => init(initializers, store))
  }

  getGnosisOptions(provider) {
    const opts = {}

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

WalletIntegrationProvider.propTypes = {
  children: PropTypes.element,
  integrations: PropTypes.object,
  store: PropTypes.object,
}
