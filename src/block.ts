import blocked_codes from 'blocked_codes.json'
import { web3CompatibleNetwork } from 'utils'

export const geoBlockedCountryCodes = new Set(blocked_codes)

export const isGeoBlocked = async () => {
  try {
    const res = await fetch('https://geoip.gnosis.pm/json/')

      // this DOES NOT block even if the URL above starts returning 404
    if (!res.ok) return false

    const { country_code } = await res.json()

    return geoBlockedCountryCodes.has(country_code)
  } catch (error) {
    console.error('Geo Blocking check is unavailable:', error.message || error, 'This is most likely a client side network connectivity issue - please retry connecting to the internet and refreshing the page.')

      // this does NOT block if there is a network error, e.g. URL is blocked
    return false
  }
}

export const isNetBlocked = async (idsToAllow: (string | number)[]) => {
  // no walletextension detected, different error - download wallet error
  if (typeof window === 'undefined' || !window.web3) return false

  try {
    const id = await web3CompatibleNetwork()

    // allow network ID matching at least 1 passed in from idsToAllow
    // and local testrpc (id = Date.now()) >> Apr 29 2018
    if (idsToAllow.includes(id as string) || +id > 1525000000000) return false
  } catch (error) {
    console.error(error)
    // web3 didn't get network, disconnected?
    return false
  }

  return true
}
