import blocked_codes from 'blocked_codes.json'
import { web3CompatibleNetwork } from 'utils'

export const geoBlockedCountryCodes = new Set(blocked_codes)

const unblockDateCheck = async () => {
  const lockPeriod = {
    start: Date.UTC(2019, 1, 10, -1),
    end: Date.UTC(2019, 2, 22, -1),
  }

  const { headers } = await fetch(window.location.origin, { mode:'same-origin', method:'HEAD' })
  const dateNow = headers.get('date') ? Date.parse(headers.get('date')) : Date.now()

  return (dateNow > lockPeriod.start && dateNow < lockPeriod.end)
}

export const isGeoBlocked = async () => {
  // default is true
  // except for DEV env + countries exempt
  try {
    const res = await fetch('https://geoip.gnosis.pm/json/')

    // this blocks if the URL above starts returning 404
    if (!res.ok) return true

    const { country_code } = await res.json()

    // TODO: remove as only TEMPORARY
    // unblock Germany (DE) during: 12/02/2019 - 22/03/2019 (dxDAO)
    if (await unblockDateCheck()) geoBlockedCountryCodes.delete('DE')

    // if user's country code does NOT match our blocked map
    // return false (= do not block)
    return geoBlockedCountryCodes.has(country_code)
  } catch (error) {
    console.error('Geo Blocking check is unavailable:', error.message || error, 'This is most likely a client side network connectivity issue - please retry connecting to the internet and refreshing the page.')

    // Blocks incase of error. Precaution
    return true
  }
}

export const isNetBlocked = async (idsToAllow: (string | number)[]) => {
  // no walletextension detected, different error - download wallet error
  if (typeof window === 'undefined' || !window.web3) return false

  try {
    // grab net ID, not string name - [true = IDs e.g 4] WHILE [blank or FALSE = NetworkName e.g 'Rinkeby']
    const id = await web3CompatibleNetwork(true)
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
