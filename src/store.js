import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import CrashReporter from 'middlewares/CrashReporter'
import LocalStorageDump from 'middlewares/LocalStorageDump'
import LocalStorageLoad from 'middlewares/LocalStorageLoad'
import Notifications from 'middlewares/Notifications'

import reducer from 'reducers'

export default function (history, initialState) {
  const middlewares = [
    thunk,
    routerMiddleware(history),
    Notifications,
    LocalStorageLoad,
    LocalStorageDump,
    CrashReporter,
  ]

  const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  const enhancer = composeEnhancers(applyMiddleware(...middlewares))

  const store = createStore(connectRouter(history)(reducer), initialState, enhancer)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line global-require
      const nextReducer = require('./reducers').default
      store.replaceReducer(connectRouter(history)(nextReducer))
    })
  }

  return store
}
