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
  activeProvider: ProviderType;
  providers: {};

  setActiveProvider(providerName: string): void;
}

interface WalletIntegrationState {
  activeProviderSet: boolean;
  error: Error;
  initialising: boolean;
  noProvidersDetected: boolean;
  web3: any;
}

class WalletIntegration extends React.Component<WalletIntegrationProps, WalletIntegrationState> {
  state = {
    activeProviderSet: false,
    error: undefined,
    initialising: false,
    noProvidersDetected: false,
    web3: undefined,
  } as WalletIntegrationState

  async componentDidMount() {
    const providerObj = Object.values(Providers)
    await registerWallets()

    if (!this.props.providers) return this.setState({ noProvidersDetected: true })
    if (providerObj.length === 1) return this.initAppWithProvider(providerObj[0].keyName)
  }

  initiateAPI = async (web3: any) => {
    // interface with contracts & connect entire DX API
    await connectContracts(web3.currentProvider)
    return connectDXAPI(web3.currentProvider)
  }

  setActiveAndInitProvider = async (providerInfo: string) => {
    const { setActiveProvider } = this.props
    const web3 = await Providers[providerInfo].initialize()

    setActiveProvider(providerInfo)
    this.setState({ web3, activeProviderSet: true })
  }

  initAppWithProvider = async (providerInfo: string) => {
    try {
      this.setState({ initialising: true, error: undefined })
      // initialize providers and return specific Web3 instances
      await this.setActiveAndInitProvider(providerInfo)
      // interface with contracts & connect entire DX API
      await this.initiateAPI(this.state.web3)

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
            message="CHECKING WALLET AVAILABILITY..."
            strokeColor="#fff"
            strokeWidth={0.35}
            render={() => (
            <>
              <h1>Please select a wallet</h1>
              <div className={!this.state.initialising ? 'lightBlue' : ''}>
                {Object.keys(Providers).map((provider: 'INJECTED_WALLET' | 'LEDGER', i: number) => {
                  const providerInfo = Providers[provider].providerName || provider
                  return (
                    <div
                      key={i}
                      onClick={() => this.initAppWithProvider(provider)}
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
    const { initialising, activeProviderSet, noProvidersDetected } = this.state,
      { activeProvider, children } = this.props
    return noProvidersDetected || ((activeProvider && activeProviderSet) && !initialising) ? children : this.walletSelector()
  }
}

const mapState = ({ blockchain: { activeProvider, providers } }: State) => ({
  activeProvider,
  providers,
})

export default connect<WalletIntegrationProps>(mapState as any, { setActiveProvider })(WalletIntegration as any)
