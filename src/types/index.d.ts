import { BigNumber } from 'bignumber.js'
import { DefaultTokens, DefaultTokenObject } from 'api/types'
export { DefaultTokens, DefaultTokenObject }

import { AuctionStatus, ProviderName, ProviderType } from 'globals'

export interface Code2Name {
  ETH: 'ETHER',
  WETH: 'WRAPPED ETHER',
  GNO: 'GNOSIS',
  REP: 'AUGUR',
  '1ST': 'FIRST BLOOD',
  OMG: 'OMISEGO',
  GNT: 'GOLEM',
  KNC: 'KYBER',
  MGN: 'MAGNOLIA',
  OWL: 'OWL',
  RDN: 'RAIDEN',
  GEN: 'DAOSTACK',
  DAI: 'DAI',
  MKR: 'MAKER',
}

export type TokenCode = keyof Code2Name
export type TokenName = Code2Name[TokenCode]
export type TokenAddresses = Account[]
export type Balance = string
export type Account = string
export type BigNumber = BigNumber

export interface Network2URL {
  RINKEBY: 'https://rinkeby.etherscan.io/',
  KOVAN: 'https://kovan.etherscan.io/',
  MAIN: 'https://etherscan.io/',
  UNKNOWN: '//localhost:5000/',
}

export interface Provider {
  name?: ProviderName,
  // providerName?: ProviderName,
  keyName: ProviderName | ProviderType,
  type?: ProviderType,
  loaded: boolean,
  available: boolean,
  unlocked: boolean,
  network?: string,
  account?: Account,
  balance?: Balance,
  priority: number,
  timestamp?: number
}

export type Providers = {
  [P in ProviderName]?: Provider;
}

export interface Blockchain {
  providers?: Providers,
  activeProvider?: ProviderType | ProviderName,
  defaultAccount?: Account,
  currentAccount?: Account,
  currentBalance?: BigNumber,
  network?: string,
  etherTokens?: object,
  gnosisInitialized?: boolean,
  gasCosts?: object,
  gasPrice?: Balance,
  ongoingAuctions?: OngoingAuctions,
  connected?: boolean,
  connectionTried?: boolean,
  providersLoaded?: boolean,
  appInitialised?: boolean,
  feeRatio?: number,
  mgnSupply?: Balance,
  useOWL?: boolean,
  appLoadBypass?: boolean,
}

export interface Modal {
  modalName: string,
  modalProps: {
    header: string,
    body: string,
    buttons?: {
      button1: {
        buttonTitle1: string,
        buttonDesc1?: string,
      },
      button2: {
        buttonTitle2: string,
        buttonDesc2?: string,
      },
    },
    footer?: { msg?: string, url?: string, urlMsg?: string },
    txData?: {
      tokenA: DefaultTokenObject,
      tokenB?: DefaultTokenObject,
      sellAmount: Balance | BigNumber,
      network?: 'RINKEBY' | 'MAIN',
      feeReductionFromOWL?: { adjustment: BigNumber, ethUSDPrice: BigNumber },
      useOWL?: boolean,
      feeRatio?: string | number,
      sellAmountAfterFee?: BigNumber,
    },
    onClick?: (choice: string) => any,
    button?: boolean,
    error?: string,
    loader?: boolean,
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
  indicesWithSellerBalance?: string[],
  balancePerIndex?: string[],
  claimInverse?: boolean,
  indicesWithSellerBalanceInverse?: string[],
  balancePerIndexInverse?: string[],
  past: {
    indicesNormal: string[],
    indicesInverse: string[],
    includesCurrentNormal: boolean,
    includesCurrentInverse: boolean,
    dirRunning: boolean,
    oppRunning: boolean,
    balanceNormal: string,
    balanceInverse: string,
    balancesPerIndexNormal: string[],
    balancesPerIndexInverse: string[],
    claimablePerIndexNormal: string[],
    claimablePerIndexInverse: string[],
    claimableBalanceNormal: string,
    claimableBalanceInverse: string,
    participatedNormal: boolean,
    participatedInverse: boolean,
    claimableNormal: boolean,
    claimableInverse: boolean,
  },
  current: {
    index: string,
    balanceNormal: string,
    balanceInverse: string,
    dirRunning: boolean,
    oppRunning: boolean,
    intThePastNormal: boolean,
    intThePastInverse: boolean,
    participatesNormal: boolean,
    participatesInverse: boolean,
    claimableNormal: boolean,
    claimableInverse: boolean,
    claimableBalanceNormal: string,
    claimableBalanceInverse: string,
    statusDir: {status: AuctionStatus, theoreticallyClosed?: boolean},
    statusOpp: {status: AuctionStatus, theoreticallyClosed?: boolean},
  },
  next: {
    index: string,
    balanceNormal: string,
    balanceInverse: string,
    participatesNormal: boolean,
    participatesInverse: boolean,
    status: {status: AuctionStatus},
  },
  auctionStart?: BigNumber,
  now?: number,
}

export type TokenBalances = { [P in Account]: BigNumber }

export interface TokenListType {
  CUSTOM: 'CUSTOM',
  DEFAULT: 'DEFAULT',
  UPLOAD: 'UPLOAD',
}

export interface TokenList {
  defaultTokenList: DefaultTokenObject[];
  customTokenList: DefaultTokenObject[];
  combinedTokenList: DefaultTokenObject[];
  type: TokenListType['CUSTOM' | 'DEFAULT' | 'UPLOAD'];
  allowUpload: boolean;
  version: number;
}

/**
 * represents chosen TokenPair
 * @sell Token to sell
 * @buy Token to receive
 * @export
 * @interface TokenPair
 */
export interface TokenPair {
  sell: DefaultTokenObject,
  buy: DefaultTokenObject,
  sellAmount?: Balance,
  index?: string,
  lastPrice?: Balance,
  allowanceLeft?: Balance,
}

/**
 * represents a buy/sell pair
 * used in TopAuctions
 */
export interface RatioPair {
  sell: DefaultTokenObject,
  buy: DefaultTokenObject,
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
  mod: TokenMod | null,
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

export interface Settings {
  disclaimer_accepted: boolean;
  networks_accepted: {
    [networkName: string]: boolean;
  }
}

export interface CookieSettings {
  analytics: boolean;
  cookies: boolean;
}

export type AccountsSet = Set<Account>

export type AvailableAuctions = Set<string>

export interface AuctionsState {
  ongoingAuctions: OngoingAuctions,
  availableAuctions: AvailableAuctions,
}

/**
 * represents global State of redux store
 * @export
 * @interface State
 */
export interface State {
  auctions: AuctionsState,
  blockchain: Blockchain,
  modal: Modal,
  ipfs: IPFS,
  ratioPairs: RatioPairs
  tokenBalances: TokenBalances,
  dxBalances: TokenBalances,
  tokenList: TokenList,
  tokenPair: TokenPair,
  tokenOverlay: TokenOverlay,
  approvedTokens: AccountsSet,
  settings: Settings & CookieSettings,
}
