import React from 'react'
import { State, Providers } from 'types'
import { connect/* , Dispatch */ } from 'react-redux'
import walletIntegration from 'integrations'
import { store } from 'components/App'
import { initiateAndSetActiveProvider } from 'actions'

// const registerWallets = () => async (dispatch: Dispatch<any>, getState: () => State) => {

// }

interface WalletIntegrationProps {
  activeProvider: string,
  providers: Providers,
  initiateAndSetActiveProvider?: (provider: string) => void,
}

class WalletIntegration extends React.Component <WalletIntegrationProps> {

  async componentWillMount() {
        // const { registerWallets } = this.props
      return walletIntegration(store)
    }

  onChange = async (providerInfo: any) => this.props.initiateAndSetActiveProvider(providerInfo)

  walletSelector = () => {
      const { providers } = this.props
      return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', width: '100%', height: '100%' }}>
                <h1>Choose a wallet</h1>
                <div className="walletChooser">
                    {Object.keys(providers).map((provider: 'INJECTED_WALLET' | 'LEDGER', i: number) => {
                      const providerInfo = providers[provider].name || provider
                      return (
                            <label key={i}>
                                <h4>{`${providerInfo} (${provider})`}</h4>
                                <input
                                    type="radio"
                                    onChange={() => this.onChange(provider)}
                                />
                            </label>)
                    })}
                </div>
            </div>
        )
    }

  render() {
      const { activeProvider, children } = this.props
      return activeProvider ? children : this.walletSelector()
    }
}

const mapState = ({ blockchain: { activeProvider, providers } }: State) => ({
  activeProvider,
  providers,
})

export default connect(mapState, { initiateAndSetActiveProvider })(WalletIntegration)
