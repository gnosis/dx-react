import { Account, Balance as B, BigNumber, TokenCode, TokenName, TokenPair } from 'types'

type Balance = B | BigNumber | number
export type Index = number | BigNumber
export interface DefaultTokens {
  elements: DefaultTokenList;
  page: number,
  hasMorePages: boolean;
  version: number;
}
export interface DefaultTokenObject {
  name: TokenName;
  symbol: TokenCode;
  address: Account;
  decimals: number;
  isETH?: boolean;
}
export type DefaultTokenList = DefaultTokenObject[]

export type Hash = string
export interface BlockReceipt {
  number: number | null, // - the block number. null when its pending block.
  hash: string | null, // - hash of the block. null when its pending block.
  parentHash: string,  // - hash of the parent block.
  nonce: string | null, // - hash of the generated proof-of-work. null when its pending block.
  sha3Uncles: string, // - SHA3 of the uncles data in the block.
  logsBloom: string, // - the bloom filter for the logs of the block. null when its pending block.
  transactionsRoot: string, // - the root of the transaction trie of the block
  stateRoot: string, // - the root of the final state trie of the block.
  miner: string, // - the address of the beneficiary to whom the mining rewards were given.
  difficulty: BigNumber, // - integer of the difficulty for this block.
  totalDifficulty: BigNumber, // - integer of the total difficulty of the chain until this block.
  extraData: string, // - the "extra data" field of this block.
  size: number, // - integer the size of this block in bytes.
  gasLimit: number, // - the maximum gas allowed in this block.
  gasUsed: number, // - the total used gas by all transactions in this block.
  timestamp: number, // - the unix timestamp for when the block was collated.
  transactions: TransactionObject[] | Hash[], // - Array of transaction objects, or 32 Bytes transaction hashes
  uncles: Hash[], // - Array of uncle hashes.
}
export interface ProviderInterface {
  getCurrentAccount(): Promise<Account>,
  getAccounts(): Promise<Account[]>,
  getBlock(bl: 'earliest' | 'latest' | 'pending' | Hash, returnTransactionObjects?: boolean): Promise<BlockReceipt>,
  getTransaction(tx: Hash): Promise<TransactionObject | null>,
  getTransactionReceipt(tx: Hash): Promise<TransactionReceipt | null>,
  getETHBalance(account: Account, inETH?: boolean): Promise<BigNumber>,
  getNetwork(): Promise<number>,
  isConnected(): boolean,
  isAddress(address: Account): boolean,
  currentProvider: Function,
  web3: any,
  setProvider(provider: any): void,
  resetProvider(): void,
  getTimestamp(block?: number | string): Promise<number>,
}

export interface TransactionObject {
  hash?: string,
  from: Account,
  to?: Account,
  value?: Balance | number,
  gas?: Balance | number,
  gasPrice?: Balance | number,
  data?: string,
  nonce?: string | number,
}

export type Web3EventLog = { _eventName: string } & {[T: string]: string | BigNumber}

export interface TransactionLog {
  logIndex: number,
  transactionIndex: number,
  transactionHash: string,
  blockHash: string,
  blockNumber: number,
  address: Account,
  data: string,
  topics: (string | null)[],
  type: 'mined' | 'pending',
}

export interface TransactionReceipt {
  transactionHash: string,
  transactionIndex: number,
  blockHash: string,
  blockNumber: number,
  gasUsed: number,
  cumulativeGasUsed: number,
  contractAddress: null | Account,
  logs: TransactionLog[],
  status: '0x1' | '0x0',
  logsBloom: string,
}

type TokensInterfaceExtended = {
  [K in keyof TokensInterface]: TokensInterface[K] extends (...args: any[]) => Promise<Receipt> ?
    TokensInterface[K] & { estimateGas?: (mainParams?: any, txParams?: TransactionObject) => any, sendTransaction?: TokensInterface<Hash>[K] } :
    TokensInterface[K]
}

export { TokensInterfaceExtended as TokensInterface }

interface TokensInterface<T = Receipt> {
  getTokenDecimals(tokenAddress: Account): Promise<BigNumber>,
  getTokenBalance(tokenAddress: Account, account: Account): Promise<BigNumber>,
  getTotalSupply(tokenAddress: Account): Promise<BigNumber>,
  transfer(tokenAddress: Account, to: Account, value: Balance, tx: TransactionObject): Promise<T>,
  transferFrom(
    tokenAddress: Account,
    from: Account,
    to: Account,
    value: Balance,
    tx: TransactionObject,
  ): Promise<T>,
  approve(tokenAddress: Account, spender: Account, value: Balance, tx: TransactionObject): Promise<T>,
  allowance(tokenAddress: Account, owner: Account, spender: Account): Promise<BigNumber>,

  ethTokenBalance(account: Account): Promise<BigNumber>,
  depositETH(tx: TransactionObject & {value: TransactionObject['value']}): Promise<T>,
  withdrawETH(value: Balance, tx: TransactionObject): Promise<T>,
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

export type ABI = {
  anonymous?: boolean,
  constant?: boolean,
  inputs: {name: string, type: string}[],
  name: string,
  outputs?: {name: string, type: string}[],
  payable?: boolean,
  stateMutability?: string,
  type: string,
}[]

export interface ContractArtifact {
  contractName: string,
  abi: ABI,
  bytecode: string,
  deployedBytecode: string,
  sourceMap: string,
  deployedSourceMap: string,
  source: string,
  sourcePath: string,
  ast: object,
  legacyAst: object,
  compiler: {
    name: string,
    version: string,
  },
  networks: {
    [P: number]: {
      events: object,
      links: object,
      address: Account,
      transactionHash: string,
    },
  }
}
export interface SimpleContract {
  address: Account | void,
  contractName: string,
  at<T = SimpleContract>(address: Account): T,
  setProvider(provider: any): void,
  deployed<T = DeployedContract>(): Promise<T>,
  abi?: ABI,
}
export interface DeployedContract {
  abi: ABI,
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

type ETHInterfaceExtended = {
  [K in keyof ETHInterface]: ETHInterface[K] extends (...args: any[]) => Promise<Receipt> ?
    ETHInterface[K] & { estimateGas?: (mainParams?: any, txParams?: TransactionObject) => any, sendTransaction?: ETHInterface<Hash>[K] } :
    ETHInterface[K]
}

export { ETHInterfaceExtended as ETHInterface }

interface ETHInterface<T = Receipt> extends ERC20Interface {
  symbol(): Promise<'ETH'>,
  name(): Promise<'Ether Token'>,
  decimals(): Promise<BigNumber>,

  deposit(tx: TransactionObject & {value: TransactionObject['value']}): Promise<T>,
  withdraw(value: Balance, tx: TransactionObject): Promise<T>,
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
  symbol(): Promise<'MGN'>,
  name(): Promise<'Magnolia Token'>,
  decimals(): Promise<BigNumber>,
  /**
   * @returns Promise<[amountUnlocked, withdrawalTime]>
   */
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

type DXAuctionExtended = {
  [K in keyof DXAuction]: DXAuction[K] extends (...args: any[]) => Promise<Receipt> ?
    DXAuction[K] & { estimateGas?: (mainParams?: any, txParams?: TransactionObject) => any, sendTransaction: DXAuction<Hash>[K]} :
    DXAuction[K]
}

export { DXAuctionExtended as DXAuction }

interface DXAuction<T = Receipt> {
  abi: ABI,
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
  getApprovedAddressesOfList(tokenAddresses: Account[]): Promise<boolean[]>,
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
  NewOracleProposal: ContractEvent,
  NewMasterCopyProposal: ContractEvent,
  NewWithdrawal: ContractEvent,
  NewSellOrder: ContractEvent,
  NewBuyOrder: ContractEvent,
  NewSellerFundsClaim: ContractEvent,
  NewBuyerFundsClaim: ContractEvent,
  NewTokenPair: ContractEvent,
  AuctionCleared: ContractEvent,
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
  updateAuctioneer(auctioneer: Account, tx: TransactionObject): Promise<T>,
  initiateEthUsdOracleUpdate(ethUSDOracle: Account, tx: TransactionObject): Promise<T>,
  updateEthUSDOracle(tx: TransactionObject): Promise<T>,
  updateThresholdNewTokenPair(thresholdNewTokenPair: Balance, tx: TransactionObject): Promise<T>,
  updateThresholdNewAuction(thresholdNewAuction: Balance, tx: TransactionObject): Promise<T>,
  updateApprovalOfToken(token: Account, approved: boolean, tx: TransactionObject): Promise<T>,
  startMasterCopyCountdown(masterCopy: Account, tx: TransactionObject): Promise<T>,
  updateMasterCopy(tx: TransactionObject): Promise<T>,
  addTokenPair(
    token1: Account,
    token2: Account,
    token1Funding: Balance,
    token2Funding: Balance,
    initialClosingPriceNum: Balance,
    initialClosingPriceDen: Balance,
    tx: TransactionObject,
  ): Promise<T>,
  deposit(tokenAddress: Account, amount: Balance, tx: TransactionObject): Promise<T>,
  withdraw(tokenAddress: Account, amount: Balance, tx: TransactionObject): Promise<T>,
  postSellOrder(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    amount: Balance,
    tx: TransactionObject,
  ): Promise<T>,
  postBuyOrder(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    amount: Balance,
    tx: TransactionObject,
  ): Promise<T>,
  claimSellerFunds(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
    tx?: TransactionObject,
  ): Promise<T>,
  claimBuyerFunds(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
    tx?: TransactionObject,
  ): Promise<T>,
  closeTheoreticalClosedAuction(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    tx: TransactionObject,
  ): Promise<T>,
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
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getPriceInPastAuction(sellToken: Account, buyToken: Account, auctionIndex: Index): Promise<[BigNumber, BigNumber]>,
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getPriceOfTokenInLastAuction(token: Account): Promise<[BigNumber, BigNumber]>,
  /**
   * @returns Promise<[priceNum, priceDen]>
   */
  getCurrentAuctionPrice(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
  ): Promise<[BigNumber, BigNumber]>,
  depositAndSell(sellToken: Account, buyToken: Account, amount: Balance, tx: TransactionObject): Promise<T>,
  claimAndWithdraw(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    auctionIndex: Index,
    amount: Balance,
    tx: TransactionObject,
  ): Promise<T>,
  getAuctionStart(tokenA: Account, tokenB: Account): Promise<BigNumber>,
  getAuctionIndex(tokenA: Account, tokenB: Account): Promise<BigNumber>,
  getTokenOrder(tokenA: Account, tokenB: Account): Promise<[Account, Account]>,
  /**
   * @returns Promise<[tokens1[], tokens2[]]>
   */
  getRunningTokenPairs(tokens: Account[]): Promise<[Account[], Account[]]>,
  /**
   * @returns Promise<[indices[], sellerBalances[]]>
   */
  getIndicesWithClaimableTokensForSellers(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    lastNAuctions: number,
  ): Promise<[BigNumber[], BigNumber[]]>,
  /**
   * @returns Promise<[indices[], buyerBalances[]]>
   */
  getIndicesWithClaimableTokensForBuyers(
    sellToken: Account,
    buyToken: Account,
    user: Account,
    lastNAuctions: number,
  ): Promise<[BigNumber[], BigNumber[]]>,
  /**
   * @returns Promise<sellerBalances[]]>
   */
  getSellerBalancesOfCurrentAuctions(
    sellTokens: Account[],
    buyTokens: Account[],
    user: Account,
  ): Promise<BigNumber[]>,
  /**
   * @returns Promise<sellerBalances[]]>
   */
  getBuyerBalancesOfCurrentAuctions(
    sellTokens: Account[],
    buyTokens: Account[],
    user: Account,
  ): Promise<BigNumber[]>,
  claimTokensFromSeveralAuctionsAsSeller(
    sellTokens: Account[],
    buyTokens: Account[],
    auctionIndices: number[],
    user: Account,
    tx: TransactionObject,
  ): Promise<T>,
  claimTokensFromSeveralAuctionsAsBuyer(
    sellTokens: Account[],
    buyTokens: Account[],
    auctionIndices: number[],
    user: Account,
  ): Promise<T>,
}

type DutchExchangeExtended = {
  [K in keyof DutchExchange]: DutchExchange[K] extends (...args: any[]) => Promise<Receipt> ?
    DutchExchange[K] & { estimateGas?: (mainParams?: any, txParams?: TransactionObject) => any, sendTransaction?: DutchExchange<Hash>[K]} :
    DutchExchange[K]
}

export { DutchExchangeExtended as DutchExchange }

interface DutchExchange<T = Receipt> {
  address: Account,

  isTokenApproved(tokenAddress: Account): Promise<boolean>,
  getApprovedAddressesOfList(tokenAddresses: Account[]): Promise<boolean[]>,

  getDXTokenBalance(tokenAddress: Account, account: Account): Promise<BigNumber>, // user's balance for a Token inside DutchX
  getLatestAuctionIndex(pair: TokenPair): Promise<BigNumber>,
  getAuctionStart(pair: TokenPair): Promise<BigNumber>,
  getClosingPrice(pair: TokenPair, index: Index): Promise<[BigNumber, BigNumber]>,
  getLastAuctionPrice(pair: TokenPair, index: Index): Promise<[BigNumber, BigNumber]>,
  getPrice(pair: TokenPair, index: Index): Promise<[BigNumber, BigNumber]>,
  getSellVolumesCurrent(pair: TokenPair): Promise<BigNumber>,
  getSellVolumesNext(pair: TokenPair): Promise<BigNumber>,
  getBuyVolumes(pair: TokenPair): Promise<BigNumber>,
  getExtraTokens(pair: TokenPair, index: Index): Promise<BigNumber>,
  getSellerBalances(pair: TokenPair, index: Index, account: Account): Promise<BigNumber>,
  getBuyerBalances(pair: TokenPair, index: Index, account: Account): Promise<BigNumber>,
  getClaimedAmounts(pair: TokenPair, index: Index, account: Account): Promise<BigNumber>,
  getRunningTokenPairs(tokenList: Account[]): Promise<[Account[], Account[]]>,
  getSellerBalancesOfCurrentAuctions(
    sellTokenArr: Account[],
    buyTokenArr: Account[],
    account: Account,
  ): Promise<number[]>,
  getIndicesWithClaimableTokensForSellers(
    pair: TokenPair,
    account: Account,
    lastNAuctions: number,
  ): Promise<[BigNumber[], BigNumber[]]>,
  claimTokensFromSeveralAuctionsAsSeller(
    sellTokenAddresses: Account[],
    buyTokenAddresses: Account[],
    indices: number[],
    account: Account,
  ): Promise<T>,
  getFeeRatio(account: Account): Promise<[BigNumber, BigNumber]>,

  postSellOrder(
    pair: TokenPair,
    amount: Balance,
    index: Index,
    account: Account,
  ): Promise<T>,
  postBuyOrder(
    pair: TokenPair,
    amount: Balance,
    index: Index,
    account: Account,
  ): Promise<T>,
  claimSellerFunds(pair: TokenPair, index: Index, account: Account): Promise<T>,
  claimBuyerFunds(pair: TokenPair, index: Index, account: Account): Promise<T>,
  claimAndWithdraw(pair: TokenPair, index: Index, amount: Balance, account: Account): Promise<T>,
  deposit(tokenAddress: Account, amount: Balance, account: Account): Promise<T>,
  withdraw(tokenAddress: Account, amount: Balance, account: Account): Promise<T>,
  depositAndSell(pair: TokenPair, amount: Balance, account: Account): Promise<T>,

  event(eventName: DutchExchangeEvents, valueFilter: object | void, filter: Filter): EventInstance,
  event(eventName: DutchExchangeEvents, valueFilter: object | void, filter: Filter, cb: ErrorFirstCallback): void,
  allEvents(filter?: Filter): EventInstance,
  allEvents(filter?: Filter, cb?: ErrorFirstCallback): void,
}

export type DutchExchangeEvents = 'NewDeposit' |
  'NewWithdrawal' |
  'NewOracleProposal' |
  'NewMasterCopyProposal' |
  'NewSellOrder' |
  'NewBuyOrder' |
  'NewSellerFundsClaim' |
  'NewBuyerFundsClaim' |
  'NewTokenPair' |
  'AuctionCleared'

type PriceOracleInterfaceExtended = {
    [K in keyof PriceOracleInterface]: PriceOracleInterface[K] extends (...args: any[]) => Promise<Receipt> ?
    PriceOracleInterface[K] & {
      estimateGas?: (mainParams?: any, txParams?: TransactionObject) => any,
      sendTransaction?: PriceOracleInterface<Hash>[K],
      call: PriceOracleInterface[K],
    } : PriceOracleInterface[K] extends Function ? PriceOracleInterface[K] & {call: PriceOracleInterface[K]}
    : PriceOracleInterface[K]
  }

export { PriceOracleInterfaceExtended as PriceOracleInterface }
interface PriceOracleInterface<T = Receipt> {
  address: Account,
  priceFeedSource(): Promise<Account>,
  owner(): Promise<Account>,
  emergencyMode(): Promise<boolean>,
  raiseEmergency(_emergencyMode: boolean, tx: TransactionObject): Promise<T>,
  updateCurator(_owner: Account, tx: TransactionObject): Promise<T>,
  getUSDETHPrice(): Promise<BigNumber>,
  NonValidPriceFeed: ContractEvent,
}

export interface PriceOracle {
  address: Account,
  getUSDETHPrice: () => Promise<BigNumber>,
}

export interface dxAPI {
  web3: ProviderInterface,
  Tokens: TokensInterfaceExtended,
  DutchX: DutchExchangeExtended,
  PriceOracle: PriceOracle,
}
