import { ETHEREUM_NETWORKS, WALLET_PROVIDER } from './constants'
import { Account, Balance } from 'types'

export interface ProviderState {
  account: Account,
  network: ETHEREUM_NETWORKS,
  balance: Balance,
  available: boolean,
  timestamp?: number,
}

export interface WalletProvider {
  providerName: WALLET_PROVIDER,
  // controls which provider is considered default
  priority: number,
  // internal flag determining if rovider was even injected
  walletAvailable?: boolean,
  // called first in initialization
  checkAvailability(): boolean,
  // creates ocal web3 instance
  initialize(): void,
  state?: ProviderState,
  web3?: any,
}

export interface ConnectedInterface {
  registerProvider: Function,
  updateProvider: Function,
}
