import blocked_codes from 'blocked_codes.json'

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

export const isNetBlocked = async () => {
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

