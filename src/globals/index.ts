import { Code2Name, TokenCode, Network2URL, DefaultTokenObject, TokenName } from 'types'

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
  'GNO',
  'OMG',
  '1ST',
  'GNT',
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

export const IPFS_TOKENS_HASH = 'QmWTuHWwmeLT359SkXfvENpnevCbHE1Cdxx2NAGjMfqEGo'

export const ALLOWED_NETWORK = 'Rinkeby Test Network'

export const FIXED_DECIMALS = 4

export const URLS = {
  METAMASK: 'https://metamask.io',
  HOW_IT_WORKS: '/content/HowItWorks',
  TOKENS: '/content/Tokens',
  FEES: '/content/Fees',
  FAQ: '/content/FAQ',
  MARKET_MAKERS: 'http://dutchx.readthedocs.io/en/latest/_static/docs/DutchX_Market_Makers.pdf',
  LISTING_A_TOKEN: 'http://dutchx.readthedocs.io/en/latest/_static/docs/DutchX_Handbook_New_Tokens.pdf',
  DUTCHX_DEVS_AND_API: 'http://dutchx.readthedocs.io/',
}
