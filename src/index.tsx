import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import App, { initializer } from 'components/App'

import blocked_codes from './blocked_codes.json'

/* global document */
const rootElement = document.getElementById('root')

const geoBlockedCountryCodes = new Set(blocked_codes)

const isGeoBlocked = async () => {
  try {
    // TODO: when production service is live do
    // const res = process.env.NODE_ENV === 'production' ? prodURL : devURL
    const res = await fetch('https://geoip.staging.gnosisdev.com/json/')
    // this blocks even if the URL above starts returning 404
    if (!res.ok) return true

    const { country_code } = await res.json()

    return geoBlockedCountryCodes.has(country_code)
  } catch (error) {
    console.error(error)
    // this blocks if there is a network error, e.g. URL is blocked
    return true
  }
}

blockIf()

async function blockIf() {
  const blocked = await isGeoBlocked()
  if (blocked) {
    window.history.replaceState(null, '', '/')
    rootElement.innerHTML = ReactDOMServer.renderToStaticMarkup(<App disabled disabledReason="geoblock" />)
  } else ReactDOM.render(<App />, rootElement, initializer)
}
