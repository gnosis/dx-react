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
  disclaimer_accepted?: boolean;

  setActiveProvider(providerName: string): void;
}

interface WalletIntegrationState {
  error: Error;
  initialising: boolean;
  noProvidersDetected: boolean;
  setupComplete: boolean;
  web3: any;
}

class WalletIntegration extends React.Component<WalletIntegrationProps, WalletIntegrationState> {
  state = {
    error: undefined,
    initialising: false,
    noProvidersDetected: false,
    setupComplete: false,
    web3: undefined,
  } as WalletIntegrationState

  async componentDidMount() {
    // user has not accepted disclaimer and is looking at cookies, how it works etc
    // OR
    // user already has activeProviden
    // THEN
    // no need to re-calc everything
    if (!this.props.disclaimer_accepted || this.props.activeProvider) return this.setState({ setupComplete: true })

    const providerObj = Object.values(Providers)
    await registerWallets()

    if (!this.props.providers) return (this.props.setActiveProvider('READ_ONLY'), this.setState({ noProvidersDetected: true }))
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
    this.setState({ web3 })
  }

  initAppWithProvider = async (providerInfo: string) => {
    try {
      this.setState({ initialising: true, error: undefined })
      // initialize providers and return specific Web3 instances
      await this.setActiveAndInitProvider(providerInfo)
      // interface with contracts & connect entire DX API
      await this.initiateAPI(this.state.web3)

      return this.setState({ initialising: false, setupComplete: true })
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
              <div className={!this.state.initialising ? 'ready' : ''}>
                {Object.keys(Providers).map((provider: 'INJECTED_WALLET' | 'LEDGER', i: number) => {
                  const providerInfo = Providers[provider].providerName || provider
                  return (
                    <div className="providerItem"
                      key={i}
                      onClick={() => this.initAppWithProvider(provider)}
                    >
                      {<img
                        src={provider2SVG(providerInfo)}
                      />}
                      <h4>{providerInfo}</h4>
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
    const { setupComplete, noProvidersDetected } = this.state,
      { children, activeProvider } = this.props
    return activeProvider && (noProvidersDetected || setupComplete) ? children : this.walletSelector()
  }
}

const mapState = ({ blockchain: { activeProvider, providers }, settings: { disclaimer_accepted } }: State) => ({
  activeProvider,
  providers,

  disclaimer_accepted,
})

export default connect<WalletIntegrationProps>(mapState as any, { setActiveProvider })(WalletIntegration as any)
