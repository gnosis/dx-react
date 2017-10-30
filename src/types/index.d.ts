import { code2tokenMap } from 'globals'

interface Code2Name {
  ETH: 'ETHER',
  GNO: 'GNOSIS',
  REP: 'AUGUR',
  '1ST': 'FIRST BLOOD',
  OMG: 'OMISEGO',
  GNT: 'GOLEM',
}

export type TokenCode = keyof Code2Name
export type TokenName = Code2Name[TokenCode]
export type Balance = string
export type Account = string

export type RatioPairs = { [pair: string]: Balance }

interface Providers {
  [provider: string]: any,
}

export interface Blockchain {
  providers?: Providers,
  activeProvider?: keyof Providers,
  defaultAccount?: Account,
  currentAccount?: Account,
  currentBalance?: Balance,
  etherTokens?: object,
  gnosisInitialized?: boolean,
  gasCosts?: Balance,
  gasPrice?: Balance,
  ongoingAuctions: OngoingAuctions,
}

export interface OngoingAuctions {
  ongoingAuctions: auctionObject[]
}

export type auctionObject = {
  id: number,
  sellToken: string,
  buyToken: string,
  buyPrice: number,
  claim: boolean,
}

export type TokenBalances = {[code in TokenCode]: Balance }


/**
 * represents chosen TokenPair
 * @sell Token to sell
 * @buy Token to receive
 * @export
 * @interface TokenPair
 */
export interface TokenPair {
  sell: TokenCode,
  buy: TokenCode
}

export type TokenMod = 'SELL' | 'RECEIVE'

/**
 * represents TokenOverlay state in TokenPicker
 * @open whether a Token is currently being chosen
 * @mod the Token will be chosen for sell or buy property in TokenPair
 * @export
 * @interface TokenOverlay
 */
export interface TokenOverlay {
  open: boolean,
  mod: TokenMod
}

/**
 * represents global State of redux store 
 * @export
 * @interface State
 */
export interface State {
  blockchain: Blockchain,
  tokenPair: TokenPair,
  tokenBalances: TokenBalances,
  tokenOverlay: TokenOverlay,
  ratioPairs: RatioPairs
}
