import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

import App, { initializer } from 'components/App'

/* global document */
const rootElement = document.getElementById('root')

// TODO: add list of blocked codes or fetch it
const geoBlockedCountryCodes = new Set().add('BG')

const isGeoBlocked = async () => {
  try {
    // TODO: when production service is live do
    // const res = process.env.NODE_ENV === 'production' ? prodURL : devURL
    const res = await fetch('https://geoip.staging.gnosisdev.com/json/')
    if (!res.ok) return true

    const { country_code } = await res.json()

    return geoBlockedCountryCodes.has(country_code)
  } catch (error) {
    console.error(error)
    return true
  }
}

blockIf()

async function blockIf() {
  const blocked = await isGeoBlocked()
  if (blocked) {
    rootElement.innerHTML = ReactDOMServer.renderToStaticMarkup(<App disabled />)
  } else ReactDOM.render(<App />, rootElement, initializer)
}
