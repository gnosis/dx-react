import { connect } from 'react-redux'
import { getActiveProvider, getSelectedProvider, getAccount } from 'selectors/blockchain'
import { supportedProviders } from 'globals'

import { State } from 'types'

import PageNotFound from 'components/PageNotFound'

const mapStateToProps = (state: State) => {
  const activeProvider = getActiveProvider(state)
  const selectedProvider = getSelectedProvider(state)
  return {
    walletEnabled: supportedProviders.has(activeProvider)
      && selectedProvider.available
      && !!getAccount(state),
  }
}

export default connect(mapStateToProps)(PageNotFound)
