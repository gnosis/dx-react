import React from 'react'

import Providers from 'integrations/provider'

import { promisedContractsMap as connectContracts } from 'api/contracts'
import { dxAPI as connectDXAPI } from 'api'
import Loader from 'components/Loader'
import { setActiveProvider } from 'actions'
import { connect } from 'react-redux'

import { initializeWallet as registerWallets } from 'components/App'

import { State } from 'types'
import { ProviderType } from 'globals'
import { provider2SVG } from 'utils'

// import all Provider SVGs
import 'assets/img/icons/providerIcons'

interface WalletIntegrationProps {
  activeProvider: ProviderType,
  setActiveProvider(providerName: string): void,
}

interface WalletIntegrationState {
  activeProviderSet: boolean,
  error: Error,
  initialising: boolean,
  web3: any,
}

class WalletIntegration extends React.Component<WalletIntegrationProps, WalletIntegrationState> {
  state = {
    activeProviderSet: undefined,
    error: undefined,
    initialising: false,
    web3: undefined,
  } as WalletIntegrationState

  async componentWillMount() {
    return registerWallets()
  }

  onChange = async (providerInfo: 'INJECTED_WALLET' | 'LEDGER') => {
    const { setActiveProvider } = this.props

    try {
      this.setState({ initialising: true, error: undefined })
      // initialize providers and return specific Web3 instances
      const web3 = await Providers[providerInfo].initialize()

      setActiveProvider(providerInfo)
      this.setState({ web3, activeProviderSet: true })

      // interface with contracts & connect entire DX API
      await connectContracts(web3.currentProvider)
      await connectDXAPI(web3.currentProvider)

      return this.setState({ initialising: false })
    } catch (error) {
      console.error(error)
      return this.setState({ error, initialising: false })
    }
  }

  walletSelector = () => {
    return (
      <div className="walletChooser">
        <Loader
            hasData={!this.state.initialising}
            message="CHECKING WALLET AVAILABLE..."
            render={() => (
            <>
              <h1>Please select a wallet</h1>
              <div className={!this.state.initialising ? 'lightBlue' : ''}>
                {Object.keys(Providers).map((provider: 'INJECTED_WALLET' | 'LEDGER', i: number) => {
                  const providerInfo = Providers[provider].providerName || provider
                  return (
                    <div
                      key={i}
                      onClick={() => this.onChange(provider)}
                    >
                      <h4>{providerInfo}</h4>
                      <br/>
                      {<img
                        src={provider2SVG(providerInfo)}
                        style={{ minHeight: 26, maxHeight: 45, marginTop: -6 }}
                      />}
                    </div>
                  )
                })}
              </div>
            </>
          )}/>
          {this.state.error && <h3>{this.state.error.message}</h3>}
      </div>
    )
  }

  render() {
    const { initialising, activeProviderSet } = this.state,
      { activeProvider, children } = this.props
    return (activeProvider && activeProviderSet) && !initialising ? children : this.walletSelector()
  }
}

const mapState = ({ blockchain: { activeProvider } }: State) => ({
  activeProvider,
})

export default connect<WalletIntegrationProps>(mapState as any, { setActiveProvider })(WalletIntegration as any)
