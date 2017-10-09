import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import 'less/style.less'

import AppRouter from 'router'
import BackdropProvider from 'containers/BackdropProvider'
import WalletIntegrationProvider from 'components/WalletIntegrationProvider'
import store from 'store'
import * as walletIntegrations from 'integrations'
import { setMomentRelativeTime } from './setup'

setMomentRelativeTime()

// load data from localstorage
store.dispatch({ type: 'INIT' })

/* global document */
const rootElement = document.getElementById('root')

// changed to browserHistory because for some reason with hashHistory render() of App
// component is triggered twice and this breaks page transition animations
const history = syncHistoryWithStore(browserHistory, store)

const render = (App) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <WalletIntegrationProvider store={store} integrations={walletIntegrations}>
          <BackdropProvider>
            <App history={history} />
          </BackdropProvider>
        </WalletIntegrationProvider>
      </Provider>
    </AppContainer>,
    rootElement,
  )
}

render(AppRouter)

if (module.hot) {
  module.hot.accept('./router', () =>
    render(require('./router').default),
  )
}
