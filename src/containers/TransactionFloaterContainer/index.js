import { connect } from 'react-redux'
import { takeRight } from 'lodash'

import TransactionFloater from 'components/TransactionFloater'

import {
  showTransactionLog,
  hideTransactionLog,
} from 'actions/transactions'

import {
  getRunningTransactions,
  getCompletedTransactions,
  getRunningTransactionsProgress,
  areLogsVisible,
} from 'selectors/transactions'

import {
  getVisibleNotifications,
} from 'selectors/notifications'

const LIMIT_COUNT_RUNNING_TRANSACTIONS = 3
const LIMIT_COUNT_COMPLETED_TRANSACTIONS = 3

const mapStateToProps = state => ({
  runningTransactions: takeRight(getRunningTransactions(state, 2), LIMIT_COUNT_RUNNING_TRANSACTIONS),
  completedTransactions: takeRight(getCompletedTransactions(state, 2), LIMIT_COUNT_COMPLETED_TRANSACTIONS),
  progress: getRunningTransactionsProgress(state),
  notifications: getVisibleNotifications(state),
  showLogs: areLogsVisible(state),
})

export default connect(mapStateToProps, {
  showTransactionLog,
  hideTransactionLog,
})(TransactionFloater)
