import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'

export const history = createHistory()
const store = createStoreWithHistory(history)

// load data from localstorage
store.dispatch({ type: 'INIT' })

/* global document */
const rootElement = document.getElementById('root')

const initializer = () => walletIntegrationCallback(store)

const render = (App: React.SFC<any> | React.ComponentClass<any>, cb?: () => {}) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ModalContainer>
          <App history={history} />
        </ModalContainer>
      </Provider>
    </AppContainer>,
    rootElement,
    cb,
  )
}

render(AppRouter, initializer)

if (module.hot) {
  module.hot.accept('./router', () =>
    render(require('./router').default))
}
