import { connect } from 'react-redux'

import Wallet from 'components/Wallet'

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

export default connect(mapStateToProps)(Wallet)
