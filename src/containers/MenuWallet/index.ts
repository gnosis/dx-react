import { connect } from 'react-redux'
import { getCurrentBalance, getAccount, State } from 'selectors/blockchain'

import MenuWallet from 'components/MenuWallet'

// TODO: move into redux or some global config
// Will need to grab tokens[name].balance from contracts
const tokens = {
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

export default connect(mapStateToProps)(MenuWallet as React.SFC<any>)
