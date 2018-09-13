import React from 'react'

import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'

import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'

import { asyncLoadSettings } from 'actions'
import { ETHEREUM_NETWORKS } from 'globals'

export const history = createHistory()
export const store = createStoreWithHistory(history)

export const loadLocalSettings = () => store.dispatch(asyncLoadSettings() as any)
export const initializeWallet = () => walletIntegrationCallback(store)

history.listen((location, action) => {
  console.log('TCL: location, action', location, action)
})

interface AppProps {
  analytics: boolean;
  disabled?: boolean;
  disabledReason?: string;
  networkAllowed?: Partial<ETHEREUM_NETWORKS>
}

const App = (props: AppProps): any => {
  const { analytics } = store.getState().settings
  return (
    <Provider store={store}>
      <ModalContainer isOpen={props.disabled} modalName={props.disabled && 'BlockModal'} {...props}>
        <AppRouter analytics={analytics} disabled={props.disabled} history={history} />
      </ModalContainer>
    </Provider>
  )}

export default App
