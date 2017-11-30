import { Account, Balance, TokenCode, TokenPair as TP } from 'types'

// TokenPair without sellAmout
type TokenPair = Pick<TP, 'sell' | 'buy'>


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
  getTokenBalance(code: TokenCode, account: Account): Promise<Balance>,
  getTotalSupply(code: TokenCode): Promise<Balance>,
  transfer(code: TokenCode, to: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  transferFrom(code: TokenCode, from: Account, to: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  approve(code: TokenCode, spender: Account, value: Balance, tx: TransactionObject): Promise<Receipt>,
  allowance(code: TokenCode, owner: Account, spender: Account): Promise<Balance>,
}

interface ErrorFirstCallback {
  (err: Error, result: any): void
}

interface ContractEvent {
  (filter: object | null, extraFilter: object | null): EventInstance,
}

interface ImmediateContractEvent {
  (filter: object | null, extraFilter: object | null, cb?: ErrorFirstCallback): void,
}

interface EventInstance {
  watch(cb: ErrorFirstCallback): void,
  stopWatching(): void,
  get(cb: ErrorFirstCallback): void,
}

export interface ERC20Interface {
  getTotalSupply(): Promise<Balance>,
  balanceOf(account?: Account): Promise<Balance>,
  transfer(to: Account, value: Balance, sender: Account): Promise<Receipt>,
  transferFrom(sender: Account, to: Account, value: Balance): Promise<Receipt>,
  approve(spender: Account, value: Balance, sender: Account): Promise<Receipt>,
  allowance(owner: Account, spender: Account): Promise<Balance>,
  Transfer(filter: object | null, extraFilter: object | null, cb?: ErrorFirstCallback): void,
  Transfer(filter: object | null, extraFilter: object | null): EventInstance,
  Approval: ContractEvent | ImmediateContractEvent,
}

export interface Receipt {
  [key: string]: any,
}

export interface Auction {
  getAuctionIndex(): number,
  getClosingPrice(index?: number): Balance,
  getPrice(index?: number): Balance,
  getSellVolumeCurrent(): Balance,
  getSellVolumeNext(): Balance,
  getBuyVolume(index?: number): Balance,
  getSellerBalances(index?: number, account?: Account): Balance,
  getBuyerBalances(index?: number, account?: Account): Balance,
  getClaimedAmounts(index?: number, account?: Account): Balance,
  postSellOrder(amount: Balance, account?: Account): Receipt
  postBuyOrder(amount: Balance, index?: number, account?: Account): Receipt,
  postBuyOrderAndClaim(amount: Balance, index?: number, account?: Account): Receipt,
  claimSellerFunds(index?: number, account?: Account): Receipt,
  claimBuyerFunds(index?: number, account?: Account): Receipt,
  // getUnclaimedBuyerFunds(index?: number, account?: Account): Receipt,
  // getUnclaimedSellerFunds(index?: number, account?: Account): Receipt,
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

  getAddress(pair: TokenPair): Account,

  getAuctionIndex(pair: TokenPair): Promise<number>,
  getClosingPrice(pair: TokenPair, index?: number): Promise<Balance>,
  getPrice(pair: TokenPair, index?: number): Promise<Balance>,
  getSellVolumeCurrent(pair: TokenPair): Promise<Balance>,
  getSellVolumeNext(pair: TokenPair): Promise<Balance>,
  getBuyVolume(pair: TokenPair, index?: number): Promise<Balance>,
  getSellerBalances(pair: TokenPair, index?: number, account?: Account): Promise<Balance>,
  getBuyerBalances(pair: TokenPair, index?: number, account?: Account): Promise<Balance>,
  getClaimedAmounts(pair: TokenPair, index?: number, account?: Account): Promise<Balance>,
  postSellOrder(pair: TokenPair, amount: Balance, account?: Account): Promise<Receipt>,
  postBuyOrder(pair: TokenPair, amount: Balance, index?: number, account?: Account): Promise<Receipt>,
  postBuyOrderAndClaim(pair: TokenPair, amount: Balance, index?: number, account?: Account): Promise<Receipt>,
  claimSellerFunds(pair: TokenPair, index?: number, account?: Account): Promise<Receipt>,
  claimBuyerFunds(pair: TokenPair, index?: number, account?: Account): Promise<Receipt>,
  // getUnclaimedBuyerFunds(pair: TokenPair, index?: number, account?: Account): Receipt,
  // getUnclaimedSellerFunds(pair: TokenPair, index?: number, account?: Account): Receipt,
  // claimSellerFundsOfAuctions(pair: TokenPair, indices: number[], account?: Account): Receipt,
  // claimBuyerFundsOfAuctions(pair: TokenPair, indices: number[], account?: Account): Receipt,
  // claimAllSellerFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // claimAllBuyerFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getAllUnclaimedSellerFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getAllUnclaimedBuyerFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getAllUnclaimedFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getIndicesOfAuctionsContainingUnclaimedBuyerFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // getIndicesOfAuctionsContainingUnclaimedSellerFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,
  // claimAllFunds(pair: TokenPair, indexStart: number, indexEnd: number, account?: Account): Receipt,

}


export interface dxAPI {
  web3: ProviderInterface,
  Tokens: TokensInterface,
  DutchX: DutchExchange,
}
