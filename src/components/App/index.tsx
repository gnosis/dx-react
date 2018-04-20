import React from 'react'

import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'

export const history = createHistory()
const store = createStoreWithHistory(history)

// load data from localstorage
store.dispatch({ type: 'INIT' })

export const initializer = () => walletIntegrationCallback(store)

const App = (): any =>
  <Provider store={store}>
    <ModalContainer>
      <AppRouter history={history} />
    </ModalContainer>
  </Provider>

export default App
