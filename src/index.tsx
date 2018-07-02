import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import App, { initializer, loadSettings } from 'components/App'

import blocked_codes from './blocked_codes.json'

// set last () => any on Array prototype
Array.prototype.last = function getLast() {
  return this[this.length - 1]
}

/* global document */
const rootElement = document.getElementById('root')

const renderApp = async () => {
  await Promise.all([
    loadSettings(),
    initializer(),
  ])

  ReactDOM.render(<App />, rootElement)
}

const geoBlockedCountryCodes = new Set(blocked_codes)

const isGeoBlocked = async () => {
  try {
    const res = await fetch('https://geoip.gnosis.pm/json/')
    
    // this DOES NOT block even if the URL above starts returning 404
    if (!res.ok) return false

    const { country_code } = await res.json()

    return geoBlockedCountryCodes.has(country_code)
  } catch (error) {
    console.error(error)
    
    // this does NOT block if there is a network error, e.g. URL is blocked
    return false
  }
}

const isNetBlocked = async () => {
  if (typeof window === 'undefined') return false
  const { hostname } = window.location
  // allow anything when run locally
  if (hostname === 'localhost' || hostname === '0.0.0.0') return false

  // no walletextension detected, different error - download wallet error
  if (!window.web3) return false

  try {
    const id = await new Promise((res, rej) => {
      window.web3.version.getNetwork((e: Error, r: string) => e ? rej(e) : res(r))
    })
    // allow Rinkeby and local testrpc (id = Date.now())
    //                      Apr 29 2018
    if (id === '4' || id > 1525000000000) return false
  } catch (error) {
    console.error(error)
    // web3 didn't get network, disconnected?
    return false
  }

  return true
}

blockIf()

async function blockIf() {
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
    rootElement.innerHTML = ReactDOMServer.renderToStaticMarkup(<App disabled disabledReason={disabledReason} />)
  } else {
    await renderApp()
  }
}
