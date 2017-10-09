import { connect } from 'react-redux'

import {
  transactionSelector,
  getTransactionLogs,
  getTransactionProgress,
  getTransactionComplete,
  didTransactionFail,
  didTransactionSucceed,
} from 'selectors/transactions'

import MarketProgress from 'components/MarketProgress'

const mapStateToProps = (state, ownProps) => ({
  logs: getTransactionLogs(state, ownProps.transactionId),
  progress: getTransactionProgress(state, ownProps.transactionId),
  complete: getTransactionComplete(state, ownProps.transactionId),
  failed: didTransactionFail(state, ownProps.transactionId),
  success: didTransactionSucceed(state, ownProps.transactionId),
  transaction: transactionSelector(state, ownProps.transactionId),
})

export default connect(mapStateToProps)(MarketProgress)
