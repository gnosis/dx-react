import React from 'react'

import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'

import { asyncLoadSettings } from 'actions'
import { ETHEREUM_NETWORKS } from 'integrations/constants'

export const history = createHistory()
export const store = createStoreWithHistory(history)

// load data from localstorage
store.dispatch({ type: 'INIT' })

export const loadSettings = () => store.dispatch(asyncLoadSettings())
export const initializer = () => walletIntegrationCallback(store)

interface AppProps {
  disabled?: boolean;
  disabledReason?: string;
  networkAllowed?: Partial<ETHEREUM_NETWORKS>
}

const App = (props: AppProps): any =>
  <Provider store={store}>
    <ModalContainer isOpen={props.disabled} modalName={props.disabled && 'BlockModal'} {...props}>
      <AppRouter disabled={props.disabled} history={history} />
    </ModalContainer>
  </Provider>

export default App
