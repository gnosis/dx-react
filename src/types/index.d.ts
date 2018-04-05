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
  index?: number,
  sell: TokenCode,
  buy: TokenCode,
  price: number,
  balance?: Balance,
  claim: boolean,
  contractAddress?: Account,
  timestamp?: string,
}

export type TokenBalances = {[code in TokenCode]?: Balance }


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

export type FileBuffer = number[]
export interface oFile {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export interface IPFS {
  oFile?: oFile,
  fileContent?: string;
  fileBuffer?: FileBuffer,
  fileHash?: string,
  filePath?: string,
}

/**
 * represents global State of redux store
 * @export
 * @interface State
 */
export interface State {
  blockchain: Blockchain,
  modal: Modal,
  ipfs: IPFS,
  tokenPair: TokenPair,
  tokenBalances: TokenBalances,
  tokenOverlay: TokenOverlay,
  ratioPairs: RatioPairs
}
