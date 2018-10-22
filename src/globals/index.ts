import { Code2Name, TokenCode, Network2URL, DefaultTokenObject, TokenName } from 'types'
import { geoBlockedCitiesToString } from 'utils'

export const COMPANY_NAME = 'slow.trade'
export const COMPANY_SLOGAN = 'Decentralised ERC20 Token Trading'

export enum ETHEREUM_NETWORKS {
  MAIN = 'MAIN',
  MORDEN = 'MORDEN',
  ROPSTEN = 'ROPSTEN',
  RINKEBY = 'RINKEBY',
  KOVAN = 'KOVAN',
  UNKNOWN = 'UNKNOWN',
}

export enum WALLET_PROVIDER {
  METAMASK = 'METAMASK',
  PARITY = 'PARITY',
  REMOTE = 'REMOTE',
  LEDGER = 'LEDGER',
}

export const networkById = {
  1: ETHEREUM_NETWORKS.MAIN,
  2: ETHEREUM_NETWORKS.MORDEN,
  3: ETHEREUM_NETWORKS.ROPSTEN,
  4: ETHEREUM_NETWORKS.RINKEBY,
  42: ETHEREUM_NETWORKS.KOVAN,
}

export const code2tokenMap: Code2Name = {
  ETH: 'ETHER',
  WETH: 'WRAPPED ETHER',
  GNO: 'GNOSIS',
  OWL: 'OWL',
  MGN: 'MAGNOLIA',
  '1ST': 'FIRST BLOOD',
  GNT: 'GOLEM',
  OMG: 'OMISEGO',
  RDN: 'RAIDEN',
  REP: 'AUGUR',
}

export const tokenSVG = new Set([
  'REP',
  'ETH',
  'WETH',
  'GNO',
  'OMG',
  '1ST',
  'GNT',
  'RDN',
  'DAI',
  'GEN',
  'MKR',
])

export const network2URL: Network2URL = {
  RINKEBY: 'https://rinkeby.etherscan.io/',
  MAIN: 'https://etherscan.io/',
  KOVAN: 'https://kovan.etherscan.io/',
  UNKNOWN: '//localhost:5000/',
}

export const network2RPCURL = {
  RINKEBY: 'https://rinkeby.infura.io/',
  UNKNOWN: 'http://127.0.0.1:8545',
}

export const codeList = Object.keys(code2tokenMap) as TokenCode[]

export enum AuctionStatus {
  INIT = 'initialising',
  PLANNED = 'planned',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ENDED = 'ended',
}

export enum ProviderType { INJECTED_WALLET = 'INJECTED_WALLET', HARDWARE_WALLET = 'HARDWARE_WALLET' }
export enum ProviderName {
  COINBASE = 'COINBASE',
  METAMASK = 'METAMASK',
  MIST = 'MIST',
  STATUS = 'STATUS',
  'GNOSIS SAFE' = 'GNOSIS SAFE',

  LEDGER = 'LEDGER',
  INJECTED_WALLET = 'INJECTED_WALLET',
}
export const supportedProviders = new Set(Object.keys(ProviderName)) as Set<ProviderName | ProviderType>

export const NETWORK_TIMEOUT = process.env.NODE_ENV === 'development' ? 200000 : 200000

export const ETH_ADDRESS = '0x0'
export const WETH_ADDRESS_RINKEBY = '0xc778417e063141139fce010982780140aa0cd5ab'

export const WETH_TEMPLATE: Pick<DefaultTokenObject, Exclude<keyof DefaultTokenObject, 'address'>> = {
  name: 'WRAPPED ETHER',
  symbol: 'WETH',
  decimals: 18,
}

export const EMPTY_TOKEN: DefaultTokenObject = {
  name: '' as TokenName,
  symbol: '' as TokenCode,
  decimals: 18,
  address: '',
}

// Network token list hashes (latest versions)
export const TESTING_TOKEN_LIST_HASH = 'QmXgUiWTumXghNuLk3vAypVeL4ycVkNKhrtWfvFHoQTJAM'

export const RINKEBY_TOKEN_LIST_HASH = process.env.FE_CONDITIONAL_ENV === 'production' ? 'QmW4NCDDZRexP5FVpMQXxNWwFHTQjCGeb5d8ywLs2XRJxR' : 'QmfB3fRGacBseNiBMhKFaYoEGDyiWnUCBPsE7Xo3sKqSyi'

export const KOVAN_TOKEN_LIST_HASH = 'QmVk68VH1D2uGx2LUGXsrfvKHQiA1R4sjw8cw4so33DPsw'
export const MAINNET_TOKEN_LIST_HASH = 'QmV9CVVDNUZckdmzSp5RVWPyQuHRcuwULYiKeY7fVp2Cct'

export const TokenListHashMap = {
  RINKEBY: RINKEBY_TOKEN_LIST_HASH,
  KOVAN: KOVAN_TOKEN_LIST_HASH,
  MAIN: MAINNET_TOKEN_LIST_HASH,
}

// Allowed network
// export const ALLOWED_NETWORK = 'Rinkeby Test Network'

// BigNumber fixed decimal places to sow
export const FIXED_DECIMALS = 4

export const GAS_PRICE = 5e9
export const GAS_LIMIT = '200000'

// Content page URLS
export const URLS = {
  METAMASK: 'https://metamask.io',
  HOW_IT_WORKS: '/content/HowItWorks',
  TOKENS: '/content/Tokens',
  FEES: '/content/Fees',
  FAQ: '/content/FAQ',
  MARKET_MAKERS: 'http://dutchx.readthedocs.io/en/latest/_static/docs/DutchX_Market_Makers.pdf',
  LISTING_A_TOKEN: 'http://dutchx.readthedocs.io/en/latest/_static/docs/DutchX_Handbook_New_Tokens.pdf',
  DUTCHX_DEVS_AND_API: 'http://dutchx.readthedocs.io/',
  HELP: '/content/Help',

  GNO_TOKEN_ETHERSCAN_URL: 'https://etherscan.io/token/0x6810e776880c02933d47db1b9fc05908e5386b96',
  WETH_TOKEN_URL: 'https://weth.io/',
  OWL_BLOG_URL: 'https://blog.gnosis.pm/wiz-turns-owl-813555100010',
  INITIAL_OWL_GENERATION_BLOG_URL: 'https://blog.gnosis.pm/generate-your-first-owl-using-gno-2205eb098f8',

  GITTER_URL: 'https://gitter.im/gnosis/DutchX',
  ETHRESEARCH_URL: 'https://ethresear.ch/t/dutchx-fully-decentralized-auction-based-exchange/2443',
  DUTCHX_TWITTER_URL: 'https://twitter.com/DutchX_',

  APP_URL_MAIN: 'slow.trade',
  APP_URL_RINKEBY: 'rinkeby.slow.trade',
  APP_URL_IPFS: {
    hostname: 'ipfs.io',
    pathname: '/ipfs/QmUy4jh5mGNZvLkjies1RWM4YuvJh5o2FYopNPVYwrRVGV',
  },
  FOOTER_LOGO_URL: 'https://gnosis.pm',
  MAIN_GAS_STATION: 'https://safe-relay.gnosis.pm/api/v1/gas-station/',
  RINKEBY_GAS_STATION: 'https://safe-relay.staging.gnosisdev.com/api/v1/gas-station/',
}

export const GA_CODES = {
  RINKEBY: 'UA-83220550-8',
  MAIN: 'UA-83220550-9',
  IPFS: 'UA-83220550-10',
}

// Error messages during TXs
export const CANCEL_TX_ERROR = 'TRANSACTION CANCELLED: User denied transaction signature. Transaction will not be submitted to the blockchain.'
export const NO_INTERNET_TX_ERROR = 'TRANSACTION CANCELLED: Internet connection issues detected. Please check your connection and try again. Transaction will not be submitted to the blockchain.'
export const LOW_GAS_ERROR = 'TRANSACTION CANCELLED: Gas limit set too low. Please try transaction again with a higher gas limit.'
export const DEFAULT_ERROR = 'TRANSACTION CANCELLED: Please check your developer console for more information.'

export const WATCHER_INTERVAL = 5000

export const AUCTION_RUN_TIME = 6 * 60 * 60 * 1000 // 6 hours in ms
export const WAITING_PERIOD = 10 * 60 * 1000 // 10 min in ms

export const BLOCKED_COUNTRIES = {
  AF: 'Afghanistan',
  CU: 'Cuba',
  KP: 'Democratic People\'s Republic of Korea',
  IR: 'Iran',
  IQ: 'Iraq',
  CN: 'People’s Republic of China',
  RU: 'Russian Federation',
  SO: 'Somalia',
  SD: 'Sudan',
  SY: 'Syria',
  AE: 'United Arab Emirates',
  US: 'United States of America',
  VU: 'Venezuela',
  YE: 'Yemen',
}

export const MAX_SELL_USD = 500 // temporary for MAINNET
export const GEO_BLOCKED_COUNTIES_LIST = geoBlockedCitiesToString()
