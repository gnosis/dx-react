import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import ProgressSpinner from 'components/ProgressSpinner'

import './marketProgress.less'

const MarketProgress = ({
  progress,
  logs,
  failed,
  success,
  transaction: { startTime, endTime },
  closeModal,
}) => {
  const timeDiff = (startTime && endTime) ? moment(startTime).to(moment(endTime), true) : undefined

  let headerText = 'Market Creation in Progress'
  if (failed) {
    headerText = 'Sorry, something went wrong...'
  } else if (success) {
    headerText = 'Market Creation successful!'
  }

  let disclaimerText = 'It will take some time until all required Smart Contracts have been created. You will be notified after all Smart Contracts have been created. You can leave this page if you want.'
  if (failed) {
    disclaimerText = 'Something went wrong during the creation of your market. Please check that you are on the right network, that you have enough funds and you entered everything correctly. Contact us if this problem persists.'
  } else if (success) {
    disclaimerText = `Your Market was created successfully. ${timeDiff ? `It took ${timeDiff}.` : ''}`
  }

  let progressBarClass = 'running'
  if (failed) {
    progressBarClass = 'error'
  } else if (success) {
    progressBarClass = 'success'
  }

  return (
    <div className="marketProgress">
      {/* eslint-disable no-script-url */}
      <a className="marketProgress__close" href="javascript:void(0);" onClick={() => closeModal()} />
      {/* eslint-enable no-script-url */}
      <div className="container">
        <div className="marketProgress__header">{headerText}</div>
        <div className="marketProgress__disclaimer">{disclaimerText}</div>
        <div className="row">
          <div className="col-md-6">
            <ProgressSpinner width={400} height={400} progress={progress} label={Math.ceil(progress * 100)} showLabel={!failed} modifier={progressBarClass} />
          </div>
          <div className="col-md-6">
            <div className="marketProgress__logs">
              {logs.length > 0 ?
                logs.map((log, index) => {
                  const isLastRunning =
                    (!log.isDone && logs[index - 1] && logs[index - 1].isDone) ||
                    (index === 0 && !log.isDone)

                  return (
                    <div className={`marketProgress__logItem ${log.isDone ? '' : 'marketProgress__logItem--running'} ${isLastRunning && !failed ? 'marketProgress__logItem--currentActive' : ''}`} key={index}>
                      {log.label}
                    </div>
                  )
                })
                : <div className="marketProgress__logItem">Starting Transactions</div>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

MarketProgress.propTypes = {
  progress: PropTypes.number,
  logs: PropTypes.arrayOf(PropTypes.shape({
    isDone: PropTypes.bool,
    label: PropTypes.string,
  })),
  success: PropTypes.bool,
  failed: PropTypes.bool,
  transaction: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
  closeModal: PropTypes.func,
}

export default MarketProgress
