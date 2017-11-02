import { connect } from 'react-redux'
import { getCurrentBalance, getAccount } from 'selectors/blockchain'
import { State, Tokens } from 'types'

import { MenuWallet, WalletProps } from 'components/MenuWallet'

// TODO: move into redux or some global config
// Will need to grab tokens[name].balance from contracts
const tokens: Tokens = {
  GNO: {
    name: 'GNO',
    balance: 12,
  },
}

const mapStateToProps = (state: State) => ({
  account: getAccount(state),
  balance: getCurrentBalance(state),
  tokens,
})

export default connect<WalletProps>(mapStateToProps)(MenuWallet)
