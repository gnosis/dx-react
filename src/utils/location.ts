import { URLS } from 'globals'

const MAIN_RINKEBY_URL = 'https://slow.trade/rinkeby'

const locationListener = (history: any) => {
  if (typeof window === 'undefined') return

    // history listen on change
  if (window.location.hostname !== URLS.APP_URLS_PROD.MAIN[0]) {
    history.listen((loc: any) => {
      const searchParams = new URLSearchParams(loc.search)
      searchParams.has('retro-x') && document.body.classList.add('THEME')
    })
  }
    // fix slow.trade/rinkeby && rinkeby#/ issue
  if (window.location.href.startsWith(MAIN_RINKEBY_URL)) {
    window.location.replace(`https://${URLS.APP_URLS_PROD.RINKEBY[0]}`)
  }
}

export default locationListener
