import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { History } from 'history'
import thunk from 'redux-thunk'

import { enableBatching } from 'redux-batched-actions'
import { CrashReporter, NoScroll, AppLoadBypass, TokenTradableChecker } from 'middlewares'

import { State } from 'types'

import reducer from 'reducers'

export default function (history: History, initialState?: Partial<State>) {
  const middlewares = [
    thunk,
    routerMiddleware(history),
    CrashReporter,
    NoScroll,
    AppLoadBypass,
    TokenTradableChecker,
  ]

  const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: true }) : compose

  const enhancer = composeEnhancers(applyMiddleware(...middlewares))

  const store = createStore(connectRouter(history)(enableBatching(reducer)), initialState, enhancer)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // @ts-ignore
      const nextReducer = require('./reducers').default
      store.replaceReducer(connectRouter(history)(nextReducer))
    })
  }

  return store
}
