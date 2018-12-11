import { URLS } from 'globals'

const locationListener = (history: any) => {
  if (typeof window === 'undefined') return

    // history listen on change
  if (window.location.hostname !== URLS.APP_URL_MAIN) {
      history.listen((loc: any) => {
          const searchParams = new URLSearchParams(loc.search)
          searchParams.has('retro-x') && document.body.classList.add('THEME')
        })
    }
    // fix slow.trade/rinkeby && rinkeby#/ issue
  if (
        window.location.href === 'https://slow.trade/rinkeby' ||
        window.location.href === 'https://slow.trade/rinkeby#' ||
        window.location.href === 'https://slow.trade/rinkeby#/'
    ) {
      window.location.replace(`https://${URLS.APP_URL_RINKEBY}`)
    }
}

export default locationListener
