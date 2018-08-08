import '@babel/polyfill'
// Array prototypes + others
import 'utils/prototypes'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import App, { loadLocalSettings, initializeWallet } from 'components/App'

import { isNetBlocked, isGeoBlocked } from 'block'

import { ALLOWED_NETWORK } from 'globals'
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

async function conditionalRender() {
  let blocked = false, disabledReason
  const netBlockedPromise = isNetBlocked()
  // geoblock gets precedence, checked first
  blocked = await isGeoBlocked()

  if (blocked) {
    disabledReason = 'geoblock'
  } else {
    blocked = await netBlockedPromise
    if (blocked) disabledReason = 'networkblock'
  }

  if (blocked) {
    window.history.replaceState(null, '', '/')
    rootElement.innerHTML = ReactDOMServer.renderToStaticMarkup(<App disabled disabledReason={disabledReason} networkAllowed={ALLOWED_NETWORK}/>)
  } else {
    await preAppRender().catch(console.error)
  }
}
