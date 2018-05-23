import { handleActions } from 'redux-actions'

import {
  TRANSACTION_STATUS,
} from 'utils/constants'

import {
  startTransactionLog,
  closeTransactionLog,
  showTransactionLog,
  hideTransactionLog,
  addTransactionLogEntry,
} from 'actions/transactions'

const reducer = handleActions({
  [startTransactionLog]: (state, action) => ({
    ...state,
    log: {
      ...state.log,
      [action.payload.id]: {
        ...action.payload,
        events: action.payload.events.map((event) => {
          if (!event.status) {
            return {
              ...event,
              status: TRANSACTION_STATUS.RUNNING,
            }
          }
          return event
        }),
      },
    },
  }),
  [closeTransactionLog]: (state, action) => {
    const { id, ...payload } = action.payload
    return {
      ...state,
      log: {
        ...state.log,
        [id]: {
          ...state.log[id],
          ...payload,
        },
      },
    }
  },
  [addTransactionLogEntry]: (state, action) => {
    const { id, ...transactionLog } = action.payload

    return {
      ...state,
      log: {
        ...state.log,
        [id]: {
          ...state.log[id],
          events: state.log[id].events.map((log) => {
            if (log.event === transactionLog.event) {
              return {
                ...log,
                ...transactionLog,
              }
            }

            return log
          }),
        },
      },
    }
  },
  [showTransactionLog]: state => ({
    ...state,
    visible: true,
  }),
  [hideTransactionLog]: state => ({
    ...state,
    visible: false,
  }),
}, { log: {}, visible: false })


export default reducer
