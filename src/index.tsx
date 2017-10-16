import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'

import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import 'less/style.less'

import AppRouter from 'router'
import WalletIntegrationProvider from 'components/WalletIntegrationProvider/index'
import createStoreWithHistory from 'store'
import * as walletIntegrations from 'integrations/'
// import { setMomentRelativeTime } from './setup'

// setMomentRelativeTime()
const history = createHistory()
const store = createStoreWithHistory(history)

// load data from localstorage
store.dispatch({ type: 'INIT' })

/* global document */
const rootElement = document.getElementById('root')

const render = (App: React.SFC<any> | React.ComponentClass<any>) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <WalletIntegrationProvider store={store} integrations={walletIntegrations}>
                    <App history={history} />
                </WalletIntegrationProvider>
            </Provider>
        </AppContainer>,
        rootElement,
    )
}

render(AppRouter)

if (module.hot) {
    module.hot.accept('./router', () =>
        // eslint-disable-next-line global-require
        render(require('./router').default))
}
