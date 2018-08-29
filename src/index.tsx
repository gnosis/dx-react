import '@babel/polyfill'
// Array prototypes + others
import 'utils/prototypes'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import App, { loadLocalSettings, initializeWallet } from 'components/App'

import { isNetBlocked, isGeoBlocked } from 'block'

import { URLS } from 'globals'
import fireListeners from 'integrations/events'

/* global document */
const rootElement = document.getElementById('root')

const preAppRender = async () => {
  // fire provider network change listener
  fireListeners()
  // load localForage settings
  // register provider + update provider state
  await Promise.all([
    loadLocalSettings(),
    initializeWallet(),
  ])

  ReactDOM.render(<App />, rootElement)
}

// block or render app to user
conditionalRender()

/*
 * App blocking prerequisites
 * Scenario 1: User is a developer running app locally:             BLOCK: nothing
 * Scenario 2: User is using the dx on dutchx.app (MAIN):           BLOCK: all networks + geoblock
 * Scenario 3: User is using the dx on dutchx-rinkeby (RINKEBY):    BLOCK: networks
*/

async function conditionalRender() {
  let blocked = false, disabledReason, ALLOWED_NETWORK

  /* User's environment does not have access to window API (e.g user on mobile?) */
  if (typeof window === 'undefined') return false
  const { hostname } = window.location

  /* Scenario 1: User is a developer running app locally: BLOCK: nothing */
  if (hostname === 'localhost' || hostname === '0.0.0.0') return preAppRender().catch(console.error)

  /* Scenario 3: User is using the dx on dutchx-rinkeby (RINKEBY): BLOCK: networks */
  else if (hostname === URLS.DUTCHX_APP_URL_RINKEBY) {
    ALLOWED_NETWORK = 'Rinkeby Test Network'
    blocked = await isNetBlocked(['4'])

    if (blocked) disabledReason = 'networkblock'
  }

  /* Scenario 2: User is using the dx on dutchx.app (MAIN): BLOCK: all networks + geoblock */
  else if (hostname === URLS.DUTCHX_APP_URL_MAIN) {
    ALLOWED_NETWORK = 'Ethereum Mainnet'
    const netBlockedPromise = isNetBlocked(['1'])
    // geoblock gets precedence, checked first
    blocked = await isGeoBlocked()

    if (blocked) {
      disabledReason = 'geoblock'
    } else {
      blocked = await netBlockedPromise
      if (blocked) disabledReason = 'networkblock'
    }
  }

  if (blocked) {
    window.history.replaceState(null, '', '/')
    return rootElement.innerHTML = ReactDOMServer.renderToStaticMarkup(<App disabled disabledReason={disabledReason} networkAllowed={ALLOWED_NETWORK}/>)
  }

  // all good? render app
  return preAppRender().catch(console.error)
}
