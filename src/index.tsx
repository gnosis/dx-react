// Array prototypes + others
// BROKEN in MM 4.10
// import 'utils/prototypes'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import ReactGA from 'react-ga'

// import fireListeners from 'integrations/events'
import App, { loadLocalSettings } from 'components/App'

import { isNetBlocked, isGeoBlocked } from 'block'

import { GA_CODES, URLS } from 'globals'

/* global document */
const rootElement = document.getElementById('root')

const preAppRender = async () => {
  // fire provider network change listener
  // fireListeners()
  // load localForage settings
  // register provider + update provider state
  await loadLocalSettings()

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
  /* User's environment does not have access to window API (e.g user on mobile?) */
  if (typeof window === 'undefined') return false
  let blocked = true, disabledReason, ALLOWED_NETWORK

  const { hostname } = window.location
  const { FE_CONDITIONAL_ENV } = process.env

  /* Scenario 1: User is a developer running app locally: BLOCK: nothing */
  if (
      FE_CONDITIONAL_ENV !== 'production' ||
      URLS.APP_URLS_DEV.includes(hostname) ||
      URLS.APP_URLS_LOCAL.includes(hostname) ||
      URLS.APP_URLS_PR_REVIEW_TEST(hostname) ||
      hostname.startsWith('10')
  ) return preAppRender().catch(console.error)

  /* PRODUCTION builds should be geoBlocked */
  if (FE_CONDITIONAL_ENV === 'production') {
    /* Scenario 1a: User is a developer on any of the STAGING URLS OR ipfs */
    if (URLS.APP_URLS_STAGING.includes(hostname) || hostname.includes('ipfs')) {
      blocked = await isGeoBlocked()
      blocked && (disabledReason = 'geoblock')

      !URLS.APP_URLS_STAGING.includes(hostname) && ReactGA.initialize(GA_CODES.IPFS)
    }
    // Main release Scenarios:
    /* Scenario 2: User is using the dx on dutchx-rinkeby (RINKEBY): BLOCK: networks */
    else if (URLS.APP_URLS_PROD.RINKEBY.includes(hostname)) {
      ALLOWED_NETWORK = 'Rinkeby Test Network'
      blocked = await isNetBlocked(['4'])
      if (blocked) disabledReason = 'networkblock'
      // init GA
      ReactGA.initialize(GA_CODES.RINKEBY)
    }
    /* Scenario 3: User is using the dx on dutchx.app (MAIN): BLOCK: all networks + geoblock */
    else if (URLS.APP_URLS_PROD.MAIN.includes(hostname)) {
      ALLOWED_NETWORK = 'Ethereum Mainnet'
      const netBlockedPromise = isNetBlocked(['1'])
      // geoblock gets precedence, checked last
      blocked = await isGeoBlocked()
      if (blocked) {
        disabledReason = 'geoblock'
      } else {
        blocked = await netBlockedPromise
        if (blocked) disabledReason = 'networkblock'
      }
      // init GA
      ReactGA.initialize(GA_CODES.MAIN)
    }
    else {
      // fallback
      console.warn('No hostname match - fallingback to geographical block')
      disabledReason = 'geoblock'
    }
  }
  // Blocked for one reason or another
  if (blocked) {
    window.history.replaceState(null, '', '/')
    return rootElement.innerHTML = ReactDOMServer.renderToStaticMarkup(<App disabled disabledReason={disabledReason} networkAllowed={ALLOWED_NETWORK}/>)
  }

  // all good? render app
  return preAppRender().catch(console.error)
}
