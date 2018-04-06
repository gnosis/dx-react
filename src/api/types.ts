import { Account, Balance as B, TokenCode, TokenPair } from 'types'
import { BigNumber } from 'bignumber.js'

type Balance = B | BigNumber | number
export type Index = number | BigNumber


export interface ProviderInterface {
  getCurrentAccount(): Promise<Account>,
  getAccounts(): Promise<Account[]>,
  getETHBalance(account: Account): Promise<BigNumber>,
  getNetwork(): Promise<number>,
  isConnected(): boolean,
  currentProvider: Function,
  web3: any,
  setProvider(provider: any): void,
  resetProvider(): void,
  getTimestamp(block?: number | string): Promise<number>,
}

export interface TransactionObject {
  from: Account,
  to?: Account,
  value?: Balance | number,
  gas?: Balance | number,
  gasPrice?: Balance | number,
  data?: string,
  nonce?: number,
}

export interface TokensInterface {
  getTokenBalance(code: TokenCode, account: Account): Promise<BigNumber>,
  getTotalSupply(code: TokenCode): Promise<BigNumber>,
  transfer(code: TokenCode, to: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  transferFrom(code: TokenCode, from: Account, to: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  approve(code: TokenCode, spender: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  allowance(code: TokenCode, owner: Account, spender: Account): Promise<BigNumber>,

  depositETH(tx: TransactionObject & {value: TransactionObject['value']}): Promise<Receipt>,
  withdrawETH(value: Balance, tx: TransactionObject): Promise<Receipt>,
}

export interface ErrorFirstCallback {
  (err: Error, result: any): void
}

export interface ContractEvent {
  (valueFilter: object | void, filter: Filter): EventInstance,
  (valueFilter: object | void, filter: Filter, cb: ErrorFirstCallback): void,
}

export interface EventInstance {
  watch(cb: ErrorFirstCallback): EventInstance,
  stopWatching(): void,
  get(cb: ErrorFirstCallback): void,
}

interface FilterObject {
  fromBlock?: number | 'latest' | 'pending',
  toBlock?: number | 'latest' | 'pending',
  address?: Account,
  topics?: (string | null)[],
}

export type Filter = 'latest' | 'pending' | FilterObject | void

export interface SimpleContract {
  address: Account | void,
  at<T = SimpleContract>(address: Account): T,
  setProvider(provider: any): void,
  deployed<T = DeployedContract>(): Promise<T>,
}
export interface DeployedContract {
  address: Account,
}

export interface ERC20Interface extends DeployedContract {
  totalSupply(): Promise<BigNumber>,
  balanceOf(account: Account): Promise<BigNumber>,
  transfer(to: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  transferFrom(from: Account, to: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  approve(spender: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  allowance(owner: Account, spender: Account): Promise<BigNumber>,
  Transfer: ContractEvent
  Approval: ContractEvent,
  allEvents(filter?: Filter, cb?: ErrorFirstCallback): void,
  allEvents(filter?: Filter): EventInstance,
}

export interface GNOInterface extends ERC20Interface {
  symbol(): Promise<'GNO'>,
  name(): Promise<'Gnosis'>,
  decimals(): Promise<BigNumber>,
}

export interface ETHInterface extends ERC20Interface {
  symbol(): Promise<'ETH'>,
  name(): Promise<'Ether Token'>,
  decimals(): Promise<BigNumber>,

  deposit(tx: TransactionObject & {value: TransactionObject['value']}): Promise<Receipt>,
  withdraw(value: Balance, tx: TransactionObject): Promise<Receipt>,
  Deposit: ContractEvent,
  Withdrawal: ContractEvent,
}

export interface OWLInterface extends ERC20Interface {
  symbol(): Promise<'OWL'>,
  name(): Promise<'OWL Token'>,
  decimals(): Promise<BigNumber>,
  creator(): Promise<Account>,
  minter(): Promise<Account>,
  masterCopyCountdownType(): never,

  startMasterCopyCountdown(_masterCopy: Account, tx: TransactionObject): Promise<Receipt>,
  updateMasterCopy(tx: TransactionObject): Promise<Receipt>,
  setMinter(newMinter: Account, tx: TransactionObject): Promise<Receipt>,
  mintOWL(to: Account, amount: Balance, tx: TransactionObject): Promise<Receipt>,
  burnOWL(amount: Balance, tx: TransactionObject): Promise<Receipt>,
  getMasterCopy(): Promise<Account>
  Minted: ContractEvent,
  Burnt: ContractEvent,
}

export interface MGNInterface extends ERC20Interface {
  owner(): Promise<Account>,
  minter(): Promise<Account>,
  unlockedTokens(account: Account): Promise<[BigNumber, BigNumber]>,
  lockedTokenBalances(account: Account): Promise<BigNumber>,

  updateOwner(_owner: Account, tx: TransactionObject): Promise<Receipt>,
  updateMinter(_minter: Account, tx: TransactionObject): Promise<Receipt>,
  mintTokens(user: Account, amount: Balance, tx: TransactionObject): Promise<Receipt>,
  lockTokens(amount: Balance, tx: TransactionObject): Promise<Receipt>,
  unlockTokens(amount: Balance, tx: TransactionObject): Promise<Receipt>,
  withdrawUnlockedTokens(tx: TransactionObject): Promise<Receipt>,
}

export interface Receipt {
  [key: string]: any,
  tx: string,
  receipt: {
    transactionHash: string,
    transactionIndex: number,
    blockHash: string,
    blockNumber: number,
    gassed: number,
    cumulativeGasUsed: number,
    contractAddress: null | Account,
    logs: {[key: string]: any}[]
    status: number,
  }
  logs: {[key: string]: any}[],
}

export interface DXAuction {
  address: Account,
  newMasterCopy(): Promise<Account>,
  masterCopyCountdown(): Promise<BigNumber>,
  auctioneer(): Promise<Account>,
  ethToken(): Promise<Account>,
  ethUSDOracle(): Promise<Account>,
  newProposalEthUSDOracle(): Promise<Account>,
  oracleInterfaceCountdown(): Promise<BigNumber>,
  thresholdNewTokenPair(): Promise<BigNumber>,
  thresholdNewAuction(): Promise<BigNumber>,
  frtToken(): Promise<Account>,
  owlToken(): Promise<Account>,
  approvedTokens(address: Account): Promise<boolean>,
  latestAuctionIndices(token1: Account, token2: Account): Promise<BigNumber>,
  auctionStarts(token1: Account, token2: Account): Promise<BigNumber>,
  closingPrices(token1: Account, token2: Account, index: Index): Promise<[BigNumber, BigNumber]>,
  sellVolumesCurrent(token1: Account, token2: Account): Promise<BigNumber>,
  sellVolumesNext(token1: Account, token2: Account): Promise<BigNumber>,
  buyVolumes(token1: Account, token2: Account): Promise<BigNumber>,
  balances(token: Account, account: Account): Promise<BigNumber>,
  extraTokens(token1: Account, token2: Account, index: Index): Promise<BigNumber>,
  sellerBalances(token1: Account, token2: Account, index: Index, account: Account): Promise<BigNumber>,
  buyerBalances(token1: Account, token2: Account, index: Index, account: Account): Promise<BigNumber>,
  claimedAmounts(token1: Account, token2: Account, index: Index, account: Account): Promise<BigNumber>,

  NewDeposit: ContractEvent,
  NewWithdrawal: ContractEvent,
  NewSellOrder: ContractEvent,
  NewBuyOrder: ContractEvent,
  NewSellerFundsClaim: ContractEvent,
  NewBuyerFundsClaim: ContractEvent,
  NewTokenPair: ContractEvent,
  AuctionCleared: ContractEvent,
  Log: ContractEvent,
  LogOutstandingVolume: ContractEvent,
  LogNumber: ContractEvent,
  ClaimBuyerFunds: ContractEvent,
  allEvents(filter: Filter, cb: ErrorFirstCallback): void,
  allEvents(filter: Filter): EventInstance,

  setupDutchExchange(
    tokenFRT: Account,
    tokenOWL: Account,
    auctioneer: Account,
    tokenETH: Account,
    ethUSDOracle: Account,
    thresholdNewTokenPair: Balance,
    thresholdNewAuction: Balance,
    tx: TransactionObject,
  ): never,
  updateAuctioneer(auctioneer: Account, tx: TransactionObject): Promise<Receipt>,
  initiateEthUsdOracleUpdate(ethUSDOracle: Account, tx: TransactionObject): Promise<Receipt>,
  updateEthUSDOracle(tx: TransactionObject): Promise<Receipt>,
  updateThresholdNewTokenPair(thresholdNewTokenPair: Balance, tx: TransactionObject): Promise<Receipt>,
  updateThresholdNewAuction(thresholdNewAuction: Balance, tx: TransactionObject): Promise<Receipt>,
  updateApprovalOfToken(token: Account, approved: boolean, tx: TransactionObject): Promise<Receipt>,
  startMasterCopyCountdown(masterCopy: Account, tx: TransactionObject): Promise<Receipt>,
  updateMasterCopy(tx: TransactionObject): Promise<Receipt>,
  addTokenPair(
    token1: Account,
    token2: Account,
    token1Funding: Balance,
    token2Funding: Balance,
    initialClosingPriceNum: Balance,
    initialClosingPriceDen: Balance,
    tx: TransactionObject,
  ): Promise<Receipt>,
  deposit(tokenAddress: Account, amount: Balance, tx: TransactionObject): Promise<Receipt>,
  withdraw(tokenAddress: Account, amount: Balance, tx: TransactionObject): Promise<Receipt>,
  postSellOrder(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    amount: Balance,
    tx: TransactionObject,
  ): Promise<Receipt>,
  postBuyOrder(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    amount: Balance,
    tx: TransactionObject,
  ): Promise<Receipt>,
  claimSellerFunds(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
    tx?: TransactionObject,
  ): Promise<Receipt>,
  claimBuyerFunds(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
    tx?: TransactionObject,
  ): Promise<Receipt>,
  closeTheoreticalClosedAuction(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    tx: TransactionObject,
  ): Promise<Receipt>,
  /**
   * @returns Promise<[unclaimedBuyerFunds, currentPriceNum, currentPriceDen]>
   */
  getUnclaimedBuyerFunds(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
  ): Promise<[BigNumber, BigNumber, BigNumber]>,
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getFeeRatio(user: Account): Promise<[BigNumber, BigNumber]>,
  getFeeRatioExt(user: Account): Promise<[BigNumber, BigNumber]>,
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getPriceInPastAuction(sellToken: Account, buyToken: Account, auctionIndex: Index): Promise<[BigNumber, BigNumber]>,
  getPriceInPastAuctionExt(sellToken: Account, buyToken: Account, auctionIndex: Index): Promise<[BigNumber, BigNumber]>,
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getPriceOfTokenInLastAuction(token: Account): Promise<[BigNumber, BigNumber]>,
  getPriceOfTokenInLastAuctionExt(token: Account): Promise<[BigNumber, BigNumber]>,
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getCurrentAuctionPrice(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
  ): Promise<[BigNumber, BigNumber]>,
  getCurrentAuctionPriceExt(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
  ): Promise<[BigNumber, BigNumber]>,
  depositAndSell(sellToken: Account, buyToken: Account, amount: Balance, tx: TransactionObject): Promise<Receipt>,
  claimAndWithdraw(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
    amount: Balance,
    tx: TransactionObject,
  ): Promise<Receipt>,
  getPriceOracleForJS(token: Account): Promise<[BigNumber, BigNumber]>,
  historicalPriceOracleForJS(token: Account, auctionIndex: Index): Promise<[BigNumber, BigNumber]>,
  computeRatioOfHistoricalPriceOraclesForJS(
    tokenA: Account,
    tokenB: Account,
    auctionIndex: Index,
  ): Promise<[BigNumber, BigNumber]>,
  getAuctionStart(tokenA: Account, tokenB: Account): Promise<BigNumber>,
  getAuctionIndex(tokenA: Account, tokenB: Account): Promise<BigNumber>,
  getTokenOrder(tokenA: Account, tokenB: Account): Promise<[Account, Account]>,
  getRunningTokenPairs(tokens: Account[]): Promise<[Account[], Account[]]>,
  getIndicesWithClaimableTokens(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    lastNAuctions: number,
  ): Promise<[BigNumber[], BigNumber[]]>,
  getSellerBalancesOfCurrentAuctions(
    sellTokens: Account[],
    buyTokens: Account[],
    user: Account,
  ): Promise<BigNumber[]>,
  getSellerBalancesOfCurrentAuctions(
    sellTokens: Account[],
    buyTokens: Account[],
    user: Account,
  ): Promise<BigNumber[]>,
  claimTokensFromSeveralAuctionsAsSeller(
    sellTokens: Account[],
    buyTokens: Account[],
    auctionIndices: number[],
    user: Account,
  ): Promise<Receipt>,
  claimTokensFromSeveralAuctionsAsBuyer(
    sellTokens: Account[],
    buyTokens: Account[],
    auctionIndices: number[],
    user: Account,
  ): Promise<Receipt>,
}

export interface DutchExchange {
  address: Account,

  isTokenApproved(code: TokenCode): Promise<boolean>,
  getBalance(code: TokenCode, account: Account): Promise<BigNumber>, // user's balance for a Token inside DutchX
  getLatestAuctionIndex(pair: TokenPair): Promise<BigNumber>,
  getAuctionStart(pair: TokenPair): Promise<BigNumber>,
  getClosingPrice(pair: TokenPair, index: Index): Promise<[BigNumber, BigNumber]>,
  getPrice(pair: TokenPair, index: Index): Promise<[BigNumber, BigNumber]>,
  getSellVolumesCurrent(pair: TokenPair): Promise<BigNumber>,
  getSellVolumesNext(pair: TokenPair): Promise<BigNumber>,
  getBuyVolumes(pair: TokenPair): Promise<BigNumber>,
  getExtraTokens(pair: TokenPair, index: Index): Promise<BigNumber>,
  getSellerBalances(pair: TokenPair, index: Index, account: Account): Promise<BigNumber>,
  getBuyerBalances(pair: TokenPair, index: Index, account: Account): Promise<BigNumber>,
  getClaimedAmounts(pair: TokenPair, index: Index, account: Account): Promise<BigNumber>,

  postSellOrder(
    pair: TokenPair,
    amount: Balance,
    index: Index,
    account: Account,
  ): Promise<Receipt>,
  postBuyOrder(
    pair: TokenPair,
    amount: Balance,
    index: Index,
    account: Account,
  ): Promise<Receipt>,
  claimSellerFunds(pair: TokenPair, index: Index, account: Account): Promise<Receipt>,
  claimBuyerFunds(pair: TokenPair, index: Index, account: Account): Promise<Receipt>,
  deposit(code: TokenCode, amount: Balance, account: Account): Promise<Receipt>,
  withdraw(code: TokenCode, amount: Balance, account: Account): Promise<Receipt>,
  depositAndSell(pair: TokenPair, amount: Balance, account: Account): Promise<Receipt>,
  claimAndWithdraw(pair: TokenPair, index: Index, amount: Balance, account: Account): Promise<Receipt>,

  event(eventName: DutchExchangeEvents, valueFilter: object | void, filter: Filter): EventInstance,
  event(eventName: DutchExchangeEvents, valueFilter: object | void, filter: Filter, cb: ErrorFirstCallback): void,
  allEvents(filter?: Filter): EventInstance,
  allEvents(filter?: Filter, cb?: ErrorFirstCallback): void,
}

export type DutchExchangeEvents = 'NewDeposit' |
  'NewWithdrawal' |
  'NewSellOrder' |
  'NewBuyOrder' |
  'NewSellerFundsClaim' |
  'NewBuyerFundsClaim' |
  'AuctionCleared'


export interface dxAPI {
  web3: ProviderInterface,
  Tokens: TokensInterface,
  DutchX: DutchExchange,
}
