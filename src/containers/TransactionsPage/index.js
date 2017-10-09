import { connect } from 'react-redux'

import {
  getRunningTransactions,
  getCompletedTransactions,
} from 'selectors/transactions'

import Transactions from 'components/Transactions'

const mapStateToProps = state => ({
  runningTransactions: getRunningTransactions(state),
  completedTransactions: getCompletedTransactions(state),
})

export default connect(mapStateToProps)(Transactions)
