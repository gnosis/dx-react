import { createAction } from 'redux-actions'
import moment from 'moment'

import {
  TRANSACTION_STATUS,
  TRANSACTION_COMPLETE_STATUS,
} from 'utils/constants'

export const startTransactionLog = createAction('START_TRANSACTION_LOG')
export const closeTransactionLog = createAction('CLOSE_TRANSACTION_LOG')
export const addTransactionLogEntry = createAction('ADD_TRANSACTION_LOG_ENTRY')

export const startLog = (id, events, label, time = moment().format()) => startTransactionLog({
  id,
  label,
  events,
  startTime: time,
})

export const closeLog = (
  id,
  status = TRANSACTION_COMPLETE_STATUS.NO_ERROR,
  time = moment().format(),
) => closeTransactionLog({
  id,
  endTime: time,
  completed: true,
  completionStatus: status,
})

export const closeEntrySuccess = (id, event) => addTransactionLogEntry({
  id,
  event,
  status: TRANSACTION_STATUS.DONE,
})

export const closeEntryError = (id, event, error) => addTransactionLogEntry({
  id,
  event,
  status: TRANSACTION_STATUS.ERROR,
  error,
})

export const showTransactionLog = createAction('SHOW_TRANSACTION_LOG')
export const hideTransactionLog = createAction('HIDE_TRANSACTION_LOG')
