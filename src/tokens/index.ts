import { Code2Name, TokenCode, DefaultTokenObject, TokenName } from 'types'

export const ETH_ADDRESS = '0x0'
export const WETH_ADDRESS_RINKEBY = '0xc778417e063141139fce010982780140aa0cd5ab'

/*
 * TOKEN SVGs
 * NEWLY ADDED TOKENS SHOULD ALSO BE ADDED HERE
 */
export const tokenSVG = new Set([
  'ETH',
  'WETH',
  '1ST',
  'DAI',
  'GEN',
  'GNO',
  'GNT',
  'KNC',
  'MKR',
  'OMG',
  'RDN',
  'REP',
])

/*
 * TRADE BLOCKED TOKENS
 */
export const TRADE_BLOCKED_TOKENS = {
  MAIN: {
        // DAI: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        // GEN: '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
        // MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        // OMG: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        // RDN: '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
  },
  RINKEBY: {},
  get noBlock() {
    return !Object.keys(this.MAIN).length && !Object.keys(this.RINKEBY).length
  },
}

export const EMPTY_TOKEN: DefaultTokenObject = {
  name: '' as TokenName,
  symbol: '' as TokenCode,
  decimals: 18,
  address: '',
}

export const WETH_TEMPLATE: Pick<DefaultTokenObject, Exclude<keyof DefaultTokenObject, 'address'>> = {
  name: 'WRAPPED ETHER',
  symbol: 'WETH',
  decimals: 18,
}

export const code2tokenMap: Code2Name = {
  ETH: 'ETHER',
  WETH: 'WRAPPED ETHER',
  '1ST': 'FIRST BLOOD',
  DAI: 'DAI',
  GEN: 'DAOSTACK',
  GNO: 'GNOSIS',
  GNT: 'GOLEM',
  KNC: 'KYBER',
  MGN: 'MAGNOLIA',
  MKR: 'MAKER',
  OMG: 'OMISEGO',
  OWL: 'OWL',
  RDN: 'RAIDEN',
  REP: 'AUGUR',
}

export const codeList = Object.keys(code2tokenMap) as TokenCode[]

// Network token list hashes (latest versions)
export const TESTING_TOKEN_LIST_HASH = 'QmXgUiWTumXghNuLk3vAypVeL4ycVkNKhrtWfvFHoQTJAM'
export const RINKEBY_TOKEN_LIST_HASH = process.env.FE_CONDITIONAL_ENV === 'production' ? 'QmW4NCDDZRexP5FVpMQXxNWwFHTQjCGeb5d8ywLs2XRJxR' : 'QmfB3fRGacBseNiBMhKFaYoEGDyiWnUCBPsE7Xo3sKqSyi'
export const KOVAN_TOKEN_LIST_HASH = 'QmVk68VH1D2uGx2LUGXsrfvKHQiA1R4sjw8cw4so33DPsw'
export const MAINNET_TOKEN_LIST_HASH = 'QmVoyJobifVKCGnwKxq7kHYbWK2XDkxz8Xg1teiqX3XVqr'

export const TokenListHashMap = {
  RINKEBY: RINKEBY_TOKEN_LIST_HASH,
  KOVAN: KOVAN_TOKEN_LIST_HASH,
  MAIN: MAINNET_TOKEN_LIST_HASH,
}
