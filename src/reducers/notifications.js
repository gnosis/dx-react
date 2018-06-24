import { handleActions } from 'redux-actions'

import {
  showNotification,
  fadeOutNotification,
  hideAllNotifications,
} from 'actions/notifications'

const reducer = handleActions({
  [showNotification]: (state, action) => ({
    ...state,
    currentVisible: [
      ...state.currentVisible,
      action.payload.id,
    ],
    log: {
      [action.payload.id]: {
        ...action.payload,
      },
      ...state.log,
    },
  }),
  [fadeOutNotification]: (state, action) => ({
    ...state,
    currentVisible: state.currentVisible.filter(
      id => id !== action.payload.id,
    ),
  }),
  [hideAllNotifications]: state => ({
    ...state,
    currentVisible: [],
  }),
}, {
  log: {},
  currentVisible: [],
})

export default reducer
