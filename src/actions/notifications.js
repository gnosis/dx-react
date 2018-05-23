import { createAction } from 'redux-actions'
import uuid from 'uuid/v4'

import {
  didTransactionSucceed,
  transactionSelector,
} from 'selectors/transactions'

import {
  DEFAULT_NOTIFICATION_FADEOUT,
} from 'utils/constants'

export const showNotification = createAction('SHOW_NOTIFICATION')
export const fadeOutNotification = createAction('FADE_OUT_NOTIFICATION')

export const createNotification = (
  title,
  message,
  icon,
  fadeOutTimer = DEFAULT_NOTIFICATION_FADEOUT,
) => async (dispatch) => {
  const notificationId = uuid()
  dispatch(showNotification({
    id: notificationId,
    title,
    message,
    icon,
  }))

  setTimeout(() => {
    dispatch(fadeOutNotification({
      id: notificationId,
    }))
  }, fadeOutTimer)
}

export const createNotificationFromTransaction = (
  transactionId,
  type = 'START',
) => (dispatch, getState) => {
  const state = getState()
  const transaction = transactionSelector(state, transactionId)

  const title = transaction.label
  let message
  let icon

  if (type === 'START') {
    message = 'Transaction started'
    icon = 'new'
  } else if (type === 'CLOSE') {
    const success = didTransactionSucceed(state, transactionId)
    message = `Transaction ${success ? 'finished successfully' : 'did not finish, errors occured'}`
    icon = success ? 'checkmark' : 'error'
  }

  dispatch(createNotification(
    title,
    message,
    icon,
  ))
}

export const hideAllNotifications = createAction('HIDE_ALL_NOTIFICATIONS')
