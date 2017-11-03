import { connect } from 'react-redux'
import { getCurrentBalance, getAccount } from 'selectors/blockchain'
import { State } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'

const mapStateToProps = (state: State) => ({
  account: getAccount(state),
  balance: getCurrentBalance(state),
  tokens: state.tokenBalances,
})

export default connect<WalletProps>(mapStateToProps)(MenuWallet)
