import { ETHEREUM_NETWORKS, WALLET_PROVIDER } from './constants'
import { Account, Balance } from 'types'

export interface ProviderState {
  account: Account,
  network: ETHEREUM_NETWORKS,
  balance: Balance,
  available: boolean,
}

export interface WalletProvider {
  providerName: WALLET_PROVIDER,
  priority: number,
  walletAvailable?: boolean,
  checkAvailability(): boolean,
  initialize(): void,
  state?: ProviderState,
  web3?: any,
}

export interface ConnectedInterface {
  registerProvider: Function,
  updateProvider: Function,
}
