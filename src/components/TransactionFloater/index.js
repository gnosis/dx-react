import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { takeRight } from 'lodash'

import moment from 'moment'

import ProgressSpinner from 'components/ProgressSpinner'
import Notifications from 'components/Notifications'

import './transactionFloater.less'

import { TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

const TransactionFloater = ({
  progress,
  runningTransactions,
  completedTransactions,
  notifications,
  showLogs,
  hideTransactionLog,
  showTransactionLog,
}) => (
  <div className="transactionFloater">
    <div className="transactionFloater__spinner" onClick={() => showLogs ? hideTransactionLog() : showTransactionLog()}>
      <ProgressSpinner
        width={32}
        height={32}
        strokeWidthPx={3}
        fontSizePx={12}
        progress={runningTransactions.length ? progress : 0}
        modifier="spinning"
        label={runningTransactions.length}
        showBar={runningTransactions.length > 0}
        minBarSize={1}
        showLabel={runningTransactions.length > 0}
      />
    </div>
    {!showLogs && notifications.length > 0 && (
    <div className="transactionFloater__popover transactionFloater--notifications">
      <Notifications notifications={takeRight(notifications, 5)} onClick={showTransactionLog} />
    </div>
  )}
    <div className={`transactionFloater__popover ${showLogs ? 'transactionFloater__popover--visible' : 'transactionFloater__popover--hidden'}`}>
      <div className="transactionFloater__heading">Transactions</div>
      <div className="transactionFloater__close" onClick={() => hideTransactionLog()} />
      <div className="transactionFloater__logs">
        {!runningTransactions.length && !completedTransactions.length && (
        <div className="transactionLog transactionLog--empty">
          <div className="transactionLog__label">You have no active or past transactions.</div>
          <div className="transactionLog__hint">When you interact with markets, all transactions will show up down here so you can keep track of all your purchases, investments and market interactions.</div>
        </div>
      )}
        {runningTransactions.map((transaction) => {
          const startTime = transaction.startTime ? moment(transaction.startTime).format('LLL') : ''

          return (
            <div key={transaction.id} className="transactionLog">
              <div className="transactionLog__progress">
                <ProgressSpinner
                  width={16}
                  height={16}
                  strokeWidthPx={1}
                  fontSizePx={8}
                  progress={transaction.progress}
                  modifier="spinning"
                />
              </div>
              <div className="transactionLog__label">{transaction.label || 'Unnamed Transaction'}</div>
              <div className="transactionLog__startTime">{startTime}</div>
            </div>
          )
        })}
        {completedTransactions.map((transaction) => {
          const endTime = transaction.endTime ? moment(transaction.endTime).format('LLL') : ''
          const timeDiff = (transaction.startTime && transaction.endTime) ? moment(transaction.startTime).to(moment(transaction.endTime), true) : undefined

          const icon = transaction.completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR ? 'checkmark' : 'error'
          return (
            <div key={transaction.id} className="transactionLog">
              <div className={`transactionLog__progressIcon icon icon--${icon}`} />
              <div className="transactionLog__label">{transaction.label || 'Unnamed Transaction'}</div>
              <div className="transactionLog__startTime">{endTime} {timeDiff && `(took ${timeDiff})`}</div>
            </div>
          )
        })}
      </div>
      <div className="transactionFloater__footer">
        <Link to="/transactions" onClick={hideTransactionLog}>Show all transactions</Link>
      </div>
    </div>
  </div>
)

TransactionFloater.propTypes = {
  progress: PropTypes.number,
  runningTransactions: PropTypes.arrayOf(PropTypes.object),
  completedTransactions: PropTypes.arrayOf(PropTypes.object),
  notifications: PropTypes.arrayOf(PropTypes.object),
  showLogs: PropTypes.bool,
  hideTransactionLog: PropTypes.func,
  showTransactionLog: PropTypes.func,
}

export default TransactionFloater
