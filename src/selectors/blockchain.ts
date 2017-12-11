// import { getCurrentAccount } from '../api/dutchx'
import { State } from 'types'
import { /* get, */ find, orderBy } from 'lodash'

export enum ProviderName { METAMASK = 'METAMASK', MIST = 'MIST' }

type Providers = {
  [P in ProviderName]: string
}

export const selector = (state: State) => state.blockchain

/**
 * Finds a default provider from all currently available providers. Determined by provider integrations `priority`
 * @param {*} state - redux state
 */
export const findDefaultProvider = (state: State) => {
  const providers = orderBy(state.blockchain.providers, ['priority'], ['desc'])

  return find(providers, {
    name: 'METAMASK',
    // loaded: true, available: true,
  })
}

export const getActiveProvider = (state: State): Providers['METAMASK' | 'MIST'] => selector(state).activeProvider

export const getSelectedProvider = (state: State): Providers | null => (
  selector(state).providers !== undefined ? selector(state).providers[selector(state).activeProvider] : null
)

export const getDefaultAccount = (state: State) => selector(state).defaultAccount

export const getAccount = (state: State) => selector(state).currentAccount

// Default account balance
export const getCurrentBalance = (state: State) => selector(state).currentBalance
