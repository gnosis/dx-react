import { connect } from 'react-redux'
import { getCurrentBalance, getAccount, getTokens } from 'selectors/blockchain'
import { State } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'

const mapStateToProps = (state: State) => ({
  account: getAccount(state),
  balance: getCurrentBalance(state),
  tokens: getTokens(state),
})

export default connect<WalletProps>(mapStateToProps)(MenuWallet)
