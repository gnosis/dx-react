import {
  createNotificationFromTransaction,
  hideAllNotifications,
} from 'actions/notifications'

let isModalOpen = false

export default store => next => (action) => {
  const handledAction = next(action)

  const { type, payload } = action

  if (type === 'SHOW_MODAL') {
    isModalOpen = true
  }

  if (type === 'CLOSE_MODAL') {
    isModalOpen = false
  }

  if (!isModalOpen) {
    if (type === 'CLOSE_TRANSACTION_LOG') {
      // intercept close log messages, fire notification handler
      store.dispatch(createNotificationFromTransaction(payload.id, 'CLOSE'))
    }

    if (type === 'START_TRANSACTION_LOG') {
      store.dispatch(createNotificationFromTransaction(payload.id, 'START'))
    }

    // disable/hide all notifications while menu is open
    if (type === 'SHOW_TRANSACTION_LOG' || type === 'HIDE_TRANSACTION_LOG') {
      store.dispatch(hideAllNotifications())
    }
  }

  return handledAction
}
