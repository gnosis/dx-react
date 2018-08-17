import React from 'react'

import Providers from 'integrations/provider'

import { promisedContractsMap as connectContracts } from 'api/contracts'
import { dxAPI as connectDXAPI } from 'api'
import Loader from 'components/Loader'
import { setActiveProvider } from 'actions'
import { connect } from 'react-redux'

import { initializeWallet as registerWallets } from 'components/App'

import ledgerSVG from 'assets/img/icons/icon_ledger.svg'
import MMSVG from 'assets/img/icons/icon_metamask3.svg'
// const registerWallets = () => async (dispatch: Dispatch<any>, getState: () => State) => {

// }

interface WalletIntegrationProps {
  setActiveProvider(providerName: string): void
}

interface WalletIntegrationState {
  activeProvider: string,
  error: Error,
  initialising: boolean,
  web3: any,
}

class WalletIntegration extends React.Component<WalletIntegrationProps, WalletIntegrationState> {
  state = {
    activeProvider: undefined,
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

      this.setState({ web3, activeProvider: providerInfo })
      setActiveProvider(providerInfo)

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
            message="Checking wallet is available..."
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
                      {provider === 'LEDGER'
                        ?
                          <img src={ledgerSVG} />
                        :
                          <img
                            src={MMSVG}
                            style={{ maxWidth: 35, marginTop: -6 }}
                          />
                      }
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
    const { activeProvider, initialising } = this.state,
      { children } = this.props
    return activeProvider && !initialising ? children : this.walletSelector()
  }
}

// const mapState = ({ blockchain: { activeProvider, providers } }: State) => ({
//   activeProvider,
//   providers,
// })

// export default connect(mapState, { initiateAndSetActiveProvider })(WalletIntegration)

export default connect<{}, WalletIntegrationProps>(undefined, { setActiveProvider })(WalletIntegration)
