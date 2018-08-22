import { Code2Name, TokenCode, Network2URL, DefaultTokenObject, TokenName } from 'types'

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
])

export const network2URL: Network2URL = {
  RINKEBY: 'https://rinkeby.etherscan.io/',
  MAIN: 'https://etherscan.io/',
  KOVAN: 'https://kovan.etherscan.io/',
  UNKNOWN: '//localhost:5000/',
}

export const codeList = Object.keys(code2tokenMap) as TokenCode[]

export enum AuctionStatus {
  INIT = 'initialising',
  PLANNED = 'planned',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ENDED = 'ended',
}

export enum ProviderName { METAMASK = 'METAMASK', MIST = 'MIST' }
export const supportedProviders = new Set(Object.keys(ProviderName)) as Set<ProviderName>

export const NETWORK_TIMEOUT = process.env.NODE_ENV === 'development' ? 200000 : 200000

export const ETH_ADDRESS = '0x0'
export const WETH_ADDRESS_RINKEBY = '0xc778417e063141139fce010982780140aa0cd5ab'

export const EMPTY_TOKEN: DefaultTokenObject = {
  name: '' as TokenName,
  symbol: '' as TokenCode,
  decimals: 18,
  address: '',
}

// Network token list hashes (latest versions)
export const TESTING_TOKEN_LIST_HASH = 'QmXgUiWTumXghNuLk3vAypVeL4ycVkNKhrtWfvFHoQTJAM'

// export const RINKEBY_TOKEN_LIST_HASH = 'QmQN7tJSVTbREv7Gd6FWZhno9RPRcFNDNkcgni6xe6wDBo'
export const RINKEBY_TOKEN_LIST_HASH = 'QmRLt9FQ8gu1Zs9wJEXtBJDagnTHFWbYjrUDuu1mZG8TCw'
export const MAINNET_TOKEN_LIST_HASH = 'QmZwJb4N9tSXme2bPoPtBg5Mz5pgct8oLVbTaqHBSsURSR'

export const TokenListHashMap = {
  RINKEBY: RINKEBY_TOKEN_LIST_HASH,
  MAIN: MAINNET_TOKEN_LIST_HASH,
}

// Allowed network
export const ALLOWED_NETWORK = 'Rinkeby Test Network'

// BigNumber fixed decimal places to sow
export const FIXED_DECIMALS = 4

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
}

// Error messages during TXs
export const CANCEL_TX_ERROR = 'TRANSACTION CANCELLED: User denied transaction signature. Transaction will not be submitted to the blockchain.'
export const NO_INTERNET_TX_ERROR = 'TRANSACTION CANCELLED: Internet connection issues detected. Please check your connection and try again. Transaction will not be submitted to the blockchain.'
export const LOW_GAS_ERROR = 'TRANSACTION CANCELLED: Gas limit set too low. Please try transaction again with a higher gas limit.'
export const DEFAULT_ERROR = 'TRANSACTION CANCELLED: Please check your developer console for more information.'

export const WATCHER_INTERVAL = 5000
