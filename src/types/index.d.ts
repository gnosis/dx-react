import BigNumber from 'bignumber.js'
import { DefaultTokens, DefaultTokenObject } from 'api/types'
import { TokenListType } from 'containers/TokenUpload'

interface Code2Name {
  ETH: 'ETHER',
  GNO: 'GNOSIS',
  REP: 'AUGUR',
  '1ST': 'FIRST BLOOD',
  OMG: 'OMISEGO',
  GNT: 'GOLEM',
  MGN: 'MAGNOLIA',
  OWL: 'OWL',
  RDN: 'RAIDEN',
}

export type TokenCode = keyof Code2Name
export type TokenName = Code2Name[TokenCode]
export type Balance = string
export type Account = string
export type BigNumber = BigNumber

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
  gasCosts?: object,
  gasPrice?: Balance,
  ongoingAuctions?: OngoingAuctions,
  connectionTried?: boolean,
  providersLoaded?: boolean,
  dutchXInitialized?: boolean,
  feeRatio?: number,
  mgnSupply?: Balance,
}

export interface Modal {
  modalName: string,
  modalProps: {
    header: string,
    body: string,
    button?: boolean,
    error?: string,
  }
  isOpen: boolean
}

export type OngoingAuctions = AuctionObject[]

/**
 * Auction Shape
 * id: timestamp? || auctionIndex? Both? Profit???
 * sellToken: token to sell
 * buyToken: token to buy
 * buyPrice: last closingPrice - from DutchExchange contract
 * claim: boolean yay or ney
 *
 *
 */
export type AuctionObject = {
  sell: {
    name: TokenName,
    symbol: TokenCode,
    address: Account,
  },
  buy: {
    name: TokenName,
    symbol: TokenCode,
    address: Account,
  },
  claim?: boolean,
  indices?: string[] | BigNumber[],
  balancePerIndex?: string[] | BigNumber[],
}

export type TokenBalances = {[code in TokenCode]?: Balance }

export interface TokenList {
  defaultTokenList: DefaultTokenObject[];
  customTokenList: DefaultTokenObject[];
  combinedTokenList: DefaultTokenObject[];
  type: TokenListType['CUSTOM' | 'DEFAULT' | 'UPLOAD'];
}

/**
 * represents chosen TokenPair
 * @sell Token to sell
 * @buy Token to receive
 * @export
 * @interface TokenPair
 */
export interface TokenPair {
  sell: TokenCode,
  buy: TokenCode,
  sellAmount?: Balance,
  index?: string,
  allowanceLeft?: Balance,
}

/**
 * represents a buy/sell pair
 * used in TopAuctions
 */
export interface RatioPair {
  sell: TokenCode,
  buy: TokenCode,
  price: Balance,
}

export type RatioPairs = RatioPair[]

export type TokenMod = 'sell' | 'buy'

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

export type FileBuffer = ArrayBuffer

export interface IPFS {
  oFile?: File,
  fileContent?: string;
  fileBuffer?: FileBuffer,
  fileHash?: string,
  filePath?: string,
  json?: Object
}

/**
 * represents global State of redux store
 * @export
 * @interface State
 */
export interface State {
  auctions: any,
  blockchain: Blockchain,
  modal: Modal,
  ipfs: IPFS,
  ratioPairs: RatioPairs
  tokenBalances: TokenBalances,
  tokenList: TokenList,
  tokenPair: TokenPair,
  tokenOverlay: TokenOverlay,
}
