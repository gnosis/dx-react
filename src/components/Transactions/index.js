import React, { PropTypes } from 'react'
import moment from 'moment'

import {
  RESOLUTION_TIME,
  TRANSACTION_COMPLETE_STATUS,
} from 'utils/constants'

import ProgressSpinner from 'components/ProgressSpinner'

import './Transactions.less'

const completionMessages = {
  [TRANSACTION_COMPLETE_STATUS.NO_ERROR]: 'Transaction finished successfully',
  [TRANSACTION_COMPLETE_STATUS.ERROR]: 'Transaction did not finish, errors occured',
  [TRANSACTION_COMPLETE_STATUS.TIMEOUT]: 'Transaction timed out',
}

const renderProgressIndicator = ({ completed, completionStatus, progress }) => {
  if (completed) {
    if (completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR) {
      return (
        <div className="transaction__icon">
          <div className="icon icon--checkmark" />
        </div>
      )
    } else {
      return (
        <div className="transaction__icon">
          <div className="icon icon--error" />
        </div>
      )
    }
  }

  return (
    <ProgressSpinner
      width={32}
      height={32}
      strokeWidthPx={1}
      fontSizePx={8}
      progress={progress}
      modifier="spinning"
    />
  )
}

const renderTransaction = type => ({
  id,
  label,
  events,
  startTime,
  endTime,
  completed,
  completionStatus,
  progress,
}) => (
  <div key={id} className={`transactionsPage__transaction transactionsPage__transaction--${type} transaction`}>
    {renderProgressIndicator({ completed, completionStatus, progress })}
    <div className="transaction__content">
      <div className="transaction__heading">{label}</div>
      <div className="transaction__details">
        <div className="transaction__detail">
          <div className="icon icon--new" />
          <div className="transaction__detailLabel">Created at</div>
          {moment(startTime).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
        </div>
        {endTime && (
          <div className="transaction__detail">
            <div className="icon icon--enddate" />
            <div className="transaction__detailLabel">Finished at</div>
            {moment(endTime).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
          </div>
        )}
        {endTime && (
          <div className="transaction__detail">
            <div className="icon icon--countdown" />
            <div className="transaction__detailLabel">Transaction Time</div>
            {`took ${moment(endTime).from(moment(startTime), true)}`}
          </div>
        )}
      </div>
      {completed && (
        <div className="transaction__message">{completionMessages[completionStatus]}</div>
      )}
    </div>
  </div>
  )

const Transactions = ({ runningTransactions, completedTransactions }) => (
  <div className="transactionsPage">
    <div className="container">
      <div className="transactionsPage__heading">
        <div className="transactionsPage__headingIcon"><div className="icon icon--new" /></div>
        Currently Running Transactions
      </div>
      {!runningTransactions.length && (
        <div className="transactionsPage__transaction transactionsPage__transaction--empty transaction">
          There are no currently running transactions
        </div>
      )}
      {runningTransactions.map(renderTransaction('running'))}
      <div className="transactionsPage__heading">
        <div className="transactionsPage__headingIcon"><div className="icon icon--countdown" /></div>
        Previous Transactions</div>
      {!completedTransactions.length && (
        <div className="transactionsPage__transaction transactionsPage__transaction--empty transaction">
          There are no previous transactions
        </div>
      )}
      {completedTransactions.map(renderTransaction('completed'))}
    </div>
  </div>
)

Transactions.propTypes = {
  runningTransactions: PropTypes.arrayOf(PropTypes.object),
  completedTransactions: PropTypes.arrayOf(PropTypes.object),
}

export default Transactions
