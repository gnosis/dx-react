import createStoreWithHistory from 'store'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

export const storeInit = (initialState?: Object | string | [any] | number) => {
  const store = createStoreWithHistory(history, initialState)

  return store
}

export const bcMetamask = {
  blockchain: {
    gasCosts: {},
    connectionTried: true,
    providers: {
      METAMASK: {
        name: 'METAMASK',
        loaded: true,
        available: false,
        priority: 90,
      },
    },
    activeProvider: 'METAMASK',
    currentAccount: '0x4d676f863980973338f8eefd1c8ec8b5b9bc6671',
    currentBalance: '99.5788472',
    providersLoaded: true,
    dutchXInitialized: true,
  },
}

export const bcLocalHost = {
  blockchain: {
    gasCosts: {},
    connectionTried: true,
    providers: {},
    activeProvider: 'http://localhost:8458',
    currentAccount: '0x4d676f863980973338f8eefd1c8ec8b5b9bc6671',
    currentBalance: '99.5788472',
    providersLoaded: true,
    dutchXInitialized: true,
  },
}

