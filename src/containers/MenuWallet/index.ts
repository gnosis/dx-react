import { connect } from 'react-redux'

import MenuWallet from 'components/MenuWallet'

interface State {
  blockchain: { 
    currentAccount?: string,
    currentBalance?: number,
  },
}

// TODO: move into redux or some global config
// Will need to grab tokens[name].balance from contracts
const tokens = {
  GNO: {
    name: 'GNO',
    balance: 12,
  },
}

const mapStateToProps = (state: State) => ({
  account: state.blockchain.currentAccount,
  balance: state.blockchain.currentBalance,
  tokens,
})

export default connect(mapStateToProps)(MenuWallet as React.SFC<any>)
