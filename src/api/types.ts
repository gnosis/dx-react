import { Account, Balance as B, TokenCode, TokenPair as TP } from 'types'
import { BigNumber } from 'bignumber.js'

// TokenPair without sellAmout
type TokenPair = Pick<TP, 'sell' | 'buy'>
type Balance = B | BigNumber
type Index = number | BigNumber


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
  getTotalSupply(): Promise<BigNumber>,
  balanceOf(account?: Account): Promise<BigNumber>,
  transfer(to: Account, value: Balance, sender: Account): Promise<Receipt>,
  transferFrom(sender: Account, to: Account, value: Balance): Promise<Receipt>,
  approve(spender: Account, value: Balance, sender: Account): Promise<Receipt>,
  allowance(owner: Account, spender: Account): Promise<BigNumber>,
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

  getAuctionIndex(pair: TokenPair): Promise<BigNumber>,
  getClosingPrice(pair: TokenPair, index?: Index): Promise<[BigNumber, BigNumber]>,
  getPrice(pair: TokenPair, index?: Index): Promise<BigNumber>,
  getSellVolumeCurrent(pair: TokenPair): Promise<BigNumber>,
  getSellVolumeNext(pair: TokenPair): Promise<BigNumber>,
  getBuyVolume(pair: TokenPair, index?: Index): Promise<BigNumber>,
  getSellerBalances(pair: TokenPair, index?: Index, account?: Account): Promise<BigNumber>,
  getBuyerBalances(pair: TokenPair, index?: Index, account?: Account): Promise<BigNumber>,
  getClaimedAmounts(pair: TokenPair, index?: Index, account?: Account): Promise<BigNumber>,
  postSellOrder(pair: TokenPair, amount: Balance, account?: Account): Promise<Receipt>,
  postBuyOrder(pair: TokenPair, amount: Balance, index?: Index, account?: Account): Promise<Receipt>,
  postBuyOrderAndClaim(pair: TokenPair, amount: Balance, index?: Index, account?: Account): Promise<Receipt>,
  claimSellerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
  claimBuyerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
  // getUnclaimedBuyerFunds(pair: TokenPair, index?: Index, account?: Account): Promise<Receipt>,
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

}


export interface dxAPI {
  web3: ProviderInterface,
  Tokens: TokensInterface,
  DutchX: DutchExchange,
}
