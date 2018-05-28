import React from 'react'

import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'

import { asyncLoadSettings } from 'actions'

export const history = createHistory()
const store = createStoreWithHistory(history)

// load data from localstorage
store.dispatch({ type: 'INIT' })

export const loadSettings = () => store.dispatch(asyncLoadSettings())
export const initializer = () => walletIntegrationCallback(store)

interface AppProps {
  disabled?: boolean;
  disabledReason?: string;
}

const App = ({ disabled, disabledReason }: AppProps): any =>
  <Provider store={store}>
    <ModalContainer isOpen={disabled} modalName={disabled && 'BlockModal'} disabledReason={disabledReason}>
      <AppRouter disabled={disabled} history={history} />
    </ModalContainer>
  </Provider>

export default App
