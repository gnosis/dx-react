import { Account, Balance as B, TokenCode, TokenPair } from 'types'
import { BigNumber } from 'bignumber.js'

type Balance = B | BigNumber | number
export type Index = number | BigNumber


export interface ProviderInterface {
  getCurrentAccount(): Promise<Account>,
  getAccounts(): Promise<Account[]>,
  getETHBalance(): Promise<Balance>,
  getNetwork(): Promise<number>,
  isConnected(): boolean,
  currentProvider: any,
  web3: any,
  setProvider(provider: any): void,
  resetProvider(): void,
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
}

export interface ErrorFirstCallback {
  (err: Error, result: any): void
}

export interface ContractEvent {
  (valueFilter: object | void, filter: Filter): EventInstance,
  (valueFilter: object | void, filter: Filter, cb: ErrorFirstCallback): void,
}

export interface EventInstance {
  watch(cb: ErrorFirstCallback): void,
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

export interface ERC20Interface {
  address: Account,
  getTotalSupply(): Promise<BigNumber>,
  balanceOf(account?: Account): Promise<BigNumber>,
  transfer(to: Account, value: Balance, sender: Account, tx?: TransactionObject): Promise<Receipt>,
  transferFrom(sender: Account, to: Account, value: Balance, tx?: TransactionObject): Promise<Receipt>,
  approve(spender: Account, value: Balance, sender: Account, tx?: TransactionObject): Promise<Receipt>,
  allowance(owner: Account, spender: Account): Promise<BigNumber>,
  Transfer(valueFilter: object | void, filter: Filter, cb?: ErrorFirstCallback): void,
  Transfer(valueFilter: object | void, filter: Filter): EventInstance,
  Approval: ContractEvent,
  allEvents(filter?: Filter, cb?: ErrorFirstCallback): void,
  allEvents(filter?: Filter): EventInstance,
}

export interface Receipt {
  [key: string]: any,
}

export interface DXAuction {
  address: Account,
  owner(): Promise<Account>,
  ETH(): Promise<Account>,
  ETHUSDOracle(): Promise<Account>,
  TUL(): Promise<Account>,
  OWL(): Promise<Account>,
  approvedTokens(address: Account): Promise<boolean>,
  latestAuctionIndices(token1: Account, token2: Account): Promise<BigNumber>,
  auctionStarts(token1: Account, token2: Account): Promise<BigNumber>,
  closingPrices(token1: Account, token2: Account, index: Index): Promise<[BigNumber, BigNumber]>,
  balances(token: Account, account: Account): Promise<BigNumber>,
  sellVolumes(token1: Account, token2: Account, index: Index): Promise<BigNumber>,
  buyVolumes(token1: Account, token2: Account, index: Index): Promise<BigNumber>,
  extraSellTokens(token1: Account, token2: Account, index: Index): Promise<BigNumber>,
  extraBuyTokens(token1: Account, token2: Account, index: Index): Promise<BigNumber>,
  sellerBalances(token1: Account, token2: Account, index: Index, account: Account): Promise<BigNumber>,
  buyerBalances(token1: Account, token2: Account, index: Index, account: Account): Promise<BigNumber>,
  claimedBalances(token1: Account, token2: Account, index: Index, account: Account): Promise<BigNumber>,

  NewDeposit: ContractEvent,
  NewWithdrawal: ContractEvent,
  NewSellOrder: ContractEvent,
  NewBuyOrder: ContractEvent,
  NewSellerFundsClaim: ContractEvent,
  NewBuyerFundsClaim: ContractEvent,
  AuctionCleared: ContractEvent,
  allEvents(filter: Filter, cb: ErrorFirstCallback): void,
  allEvents(filter: Filter): EventInstance,

  updateOwner(account: Account, tx?: TransactionObject): Promise<Receipt>,
  updateApprovalOfToken(token: Account, approved: boolean, tx?: TransactionObject): Promise<Receipt>,
  updateETHUSDPriceOracle(_ETHUSDOracletoken: Account, tx?: TransactionObject): Promise<Receipt>,
  addTokenPair(
    token1: Account,
    token2: Account,
    initialClosingPriceNum: Balance,
    initialClosingPriceDen: Balance,
    token1Funding: Balance,
    token2Funding: Balance,
    tx?: TransactionObject,
  ): Promise<Receipt>,
  deposit(tokenAddress: Account, amount: Balance, tx?: TransactionObject): Promise<Receipt>,
  withdraw(tokenAddress: Account, amount: Balance, tx?: TransactionObject): Promise<Receipt>,
  postSellOrder(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    amount: Balance,
    amountOfWIZToBurn: Balance,
    tx?: TransactionObject,
  ): Promise<Receipt>,
  postBuyOrder(
    sellToken: Account,
    buyToken: Account,
    auctionIndex: Index,
    amount: Balance,
    amountOfWIZToBurn: Balance,
    tx?: TransactionObject,
  ): Promise<Receipt>,
  claimSellerFuncds(
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
  getUnclaimedBuyerFunds(sellToken: Account, buyToken: Account, user: Account, auctionIndex: Index): Promise<BigNumber>,
  // getUnclaimedSellerFunds(sellToken: Account, buyToken: Account, user: Account, auctionIndex: Index): Promise<Receipt>,
  getPrice(sellToken: Account, buyToken: Account, auctionIndex: Index): Promise<[BigNumber, BigNumber]>,
  priceOracle(token: Account): Promise<[BigNumber, BigNumber]>,

  // claimSellerFundsOfAuctions(indices: number[], account?: Account): Receipt,
  // claimBuyerFundsOfAuctions(indices: number[], account?: Account): Receipt,
  // claimAllSellerFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // claimAllBuyerFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getAllUnclaimedSellerFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getAllUnclaimedBuyerFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getAllUnclaimedFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getIndicesOfAuctionsContainingUnclaimedBuyerFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getIndicesOfAuctionsContainingUnclaimedSellerFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,
  // claimAllFunds(indexStart: number, indexEnd: number, account?: Account): Receipt,

}

export interface DutchExchange {
  // getAuction(pair: TokenPair): Auction,

  address: Account,

  isTokenApproved(code: TokenCode): Promise<boolean>,
  getBalance(code: TokenCode, account?: Account): Promise<BigNumber>, // user's balance for a Token inside DutchX
  getLatestAuctionIndex(pair: TokenPair): Promise<BigNumber>,
  getAuctionStart(pair: TokenPair): Promise<BigNumber>,
  getClosingPrice(pair: TokenPair, index?: Index): Promise<[BigNumber, BigNumber]>,
  getPrice(pair: TokenPair, index?: Index): Promise<[BigNumber, BigNumber]>,
  // getSellVolumeCurrent(pair: TokenPair): Promise<BigNumber>,
  // getSellVolumeNext(pair: TokenPair): Promise<BigNumber>,
  getSellVolume(pair: TokenPair, index?: Index): Promise<BigNumber>,
  getBuyVolume(pair: TokenPair, index?: Index): Promise<BigNumber>,
  getExtraSellTokens(pair: TokenPair, index?: Index): Promise<BigNumber>,
  getExtraBuyTokens(pair: TokenPair, index?: Index): Promise<BigNumber>,
  getSellerBalance(pair: TokenPair, index?: Index, account?: Account): Promise<BigNumber>,
  getBuyerBalance(pair: TokenPair, index?: Index, account?: Account): Promise<BigNumber>,
  getClaimedAmount(pair: TokenPair, index?: Index, account?: Account): Promise<BigNumber>,
  postSellOrder(
    pair: TokenPair,
    amount: Balance,
    amountOfWIZToBurn: Balance,
    index?: Index,
    account?: Account,
  ): Promise<Receipt>,
  postBuyOrder(
    pair: TokenPair,
    amount: Balance,
    amountOfWIZToBurn: Balance,
    index?: Index,
    account?: Account,
  ): Promise<Receipt>,
  // postBuyOrderAndClaim(pair: TokenPair, amount: Balance, index?: Index, account?: Account): Promise<Receipt>,
  claimSellerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
  claimBuyerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
  getUnclaimedBuyerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
  // getUnclaimedSellerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
  // claimSellerFundsOfAuctions(pair: TokenPair, indices: Index[], account?: Account): Promise<Receipt>,
  // claimBuyerFundsOfAuctions(pair: TokenPair, indices: Index[], account?: Account): Promise<Receipt>,
  // claimAllSellerFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // claimAllBuyerFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // getAllUnclaimedSellerFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // getAllUnclaimedBuyerFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // getAllUnclaimedFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // getIndicesOfAuctionsContainingUnclaimedBuyerFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // getIndicesOfAuctionsContainingUnclaimedSellerFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,
  // claimAllFunds(pair: TokenPair, indexStart: Index, indexEnd: Index, account?: Account): Promise<Receipt>,

  deposit(code: TokenCode, amount: Balance, account?: Account): Promise<Receipt>,
  withdraw(code: TokenCode, amount: Balance, account?: Account): Promise<Receipt>,

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
