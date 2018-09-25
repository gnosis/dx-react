import React from 'react'

import { Provider } from 'react-redux'
import createHistory from 'history/createHashHistory'

import 'styles/global.scss'

import AppRouter from 'router'

import walletIntegrationCallback from 'integrations/'
import createStoreWithHistory from 'store'

import ModalContainer from 'containers/Modals'

import { asyncLoadSettings } from 'actions'
import { ETHEREUM_NETWORKS, URLS } from 'globals'

export const history = createHistory()
export const store = createStoreWithHistory(history)

export const loadLocalSettings = () => store.dispatch(asyncLoadSettings() as any)
export const initializeWallet = () => walletIntegrationCallback(store)

interface AppProps {
  analytics: boolean;
  disabled?: boolean;
  disabledReason?: string;
  networkAllowed?: Partial<ETHEREUM_NETWORKS>
}

const App = (props: AppProps): any => {
  const { settings: { analytics } } = store.getState()
  return (
    <Provider store={store}>
      <ModalContainer isOpen={props.disabled} modalName={props.disabled && 'BlockModal'} {...props}>
        <AppRouter analytics={analytics} disabled={props.disabled} history={history} />
      </ModalContainer>
    </Provider>
  )}

// history listen on change
if (window.location.hostname !== URLS.APP_URL_MAIN) {
  history.listen((loc: any) => {
    const searchParams = new URLSearchParams(loc.search)
    searchParams.has('retro-x') && document.body.classList.add('THEME')
  })
}

export default App
