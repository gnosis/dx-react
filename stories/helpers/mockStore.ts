import createStoreWithHistory from 'store'
import createHistory from 'history/createBrowserHistory'
import { State } from 'types'
const history = createHistory()

export const storeInit = (initialState?: Partial<State>) => {
  const store = createStoreWithHistory(history, initialState)

  return store
}

export const bcMetamask: Partial<State> = {
  blockchain: {
    gasCosts: {},
    connectionTried: true,
    providers: {
      METAMASK: {
        name: 'METAMASK',
        loaded: true,
        available: true,
        priority: 90,
      },
    },
    activeProvider: 'METAMASK',
    currentAccount: '0x4d676f863980973338f8eefd1c8ec8b5b9bc6671',
    currentBalance: '99.5788472',
    providersLoaded: true,
    dutchXInitialized: true,
    ongoingAuctions: [],
  },
  tokenBalances: {
    GNO: '0.12364',
    ETH: '0.46783',
  },
}

export const bcLocalHost: Partial<State> = {
  blockchain: {
    gasCosts: {},
    connectionTried: true,
    providers: {},
    activeProvider: 'http://localhost:8458',
    currentAccount: '0x4d676f863980973338f8eefd1c8ec8b5b9bc6671',
    currentBalance: '99.5788472',
    providersLoaded: true,
    dutchXInitialized: true,
    ongoingAuctions: [],
  },
  tokenBalances: {
    GNO: '0.12364',
  },
}

export const tokenPairState: Partial<State> = {
  tokenPair: {
    sell: 'ETH',
    buy: '1ST',
    sellAmount: '0',
  },
}
