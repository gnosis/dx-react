import createStoreWithHistory from 'store'
import createHistory from 'history/createBrowserHistory'
import { toBigNumber } from 'web3/lib/utils/utils.js'
import { State } from 'types'
import { ProviderName } from 'globals'

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
        name: ProviderName.METAMASK,
        loaded: true,
        available: true,
        unlocked: true,
        priority: 90,
      },
    },
    activeProvider: ProviderName.METAMASK,
    currentAccount: '0x4d676f863980973338f8eefd1c8ec8b5b9bc6671',
    currentBalance: toBigNumber('99.5788472'),
    providersLoaded: true,
    dutchXInitialized: true,
    ongoingAuctions: [],
  },
  tokenBalances: {
    GNO: toBigNumber('0.12364'),
    ETH: toBigNumber('0.46783'),
  },
}

export const bcLocalHost: Partial<State> = {
  blockchain: {
    gasCosts: {},
    connectionTried: true,
    providers: {},
    activeProvider: 'http://localhost:8458' as ProviderName,
    currentAccount: '0x4d676f863980973338f8eefd1c8ec8b5b9bc6671',
    currentBalance: toBigNumber('99.5788472'),
    providersLoaded: true,
    dutchXInitialized: true,
    ongoingAuctions: [],
  },
  tokenBalances: {
    GNO: toBigNumber('0.12364'),
  },
}

export const tokenPairState: Partial<State> = {
  tokenPair: {
    sell: { name: 'ETHER', symbol: 'ETH', address: '', decimals: 18 },
    buy: { name: 'FIRST BLOOD', symbol: '1ST', address: '', decimals: 18 },
    sellAmount: '0',
  },
}
