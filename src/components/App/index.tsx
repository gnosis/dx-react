import React from 'react'

import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'
import AppValidator from 'containers/AppValidator'

import { asyncLoadSettings } from 'actions'
import { ETHEREUM_NETWORKS } from 'integrations/constants'

export const history = createHistory()
export const store = createStoreWithHistory(history)

// load data from localstorage
store.dispatch({ type: 'INIT' })

export const loadLocalSettings = () => store.dispatch(asyncLoadSettings())
export const initializeWallet = () => walletIntegrationCallback(store)

interface AppProps {
  disabled?: boolean;
  disabledReason?: string;
  networkAllowed?: Partial<ETHEREUM_NETWORKS>
}

const App = (props: AppProps): any =>
  <Provider store={store}>
    <AppValidator>
      <ModalContainer isOpen={props.disabled} modalName={props.disabled && 'BlockModal'} {...props}>
        <AppRouter disabled={props.disabled} history={history} />
      </ModalContainer>
    </AppValidator>
  </Provider>

export default App
