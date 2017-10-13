import { connect } from 'react-redux'
import BalanceButton from 'contract-fe-test/components/BalanceButton'

import { getBalance } from 'contract-fe-test/actions/Balance'

const mapStateToProps = state => ({
  balance: state.balance.currentBalance,
  provider: state.blockchain.providers.METAMASK ? state.blockchain.providers.METAMASK.account : null,
})

const mapDispatchToProps = dispatch => ({
  dispatchGetBalance: (c, a) => dispatch(getBalance(c, a)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BalanceButton)
