import { connect } from 'react-redux'
import { getActiveProvider, getSelectedProvider, getAccount } from 'selectors/blockchain'
import { supportedProviders } from 'globals'

import { State } from 'types'

import Home from 'components/Home'

const mapStateToProps = (state: State) => {
  const activeProvider = getActiveProvider(state)
  const selectedProvider = getSelectedProvider(state)
  return {
    walletEnabled: supportedProviders.has(activeProvider)
      && (selectedProvider.available || selectedProvider.keyName === 'LEDGER')
      && !!getAccount(state),
  }
}

export default connect(mapStateToProps)(Home)
