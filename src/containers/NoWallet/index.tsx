import { connect } from 'react-redux'
import { State } from 'types'
import { getSelectedProvider, getAccount } from 'selectors/blockchain'

import NoWallet from 'components/NoWallet'

const mapStateToProps = (state: State) => {
  const selectedProvider = getSelectedProvider(state)
  return {
    walletUnavailable: !(selectedProvider && selectedProvider.available),
    walletLocked: !getAccount(state),
  }
}

export default connect(mapStateToProps)(NoWallet)
