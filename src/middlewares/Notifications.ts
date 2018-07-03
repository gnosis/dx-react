/* import {
  createNotificationFromTransaction,
  hideAllNotifications,
} from 'actions/notifications'

import { Middleware, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from 'types'

let isModalOpen = false

interface ActionWithPayload extends Action {
  payload: any
}

const Notifications: Middleware = store => next => (action: Action | ThunkAction<Action, Partial<State>, void>) => {
  const handledAction = next(action as Action)

  const { type, payload } = action as ActionWithPayload

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

export default Notifications
 */
