// import { getCurrentAccount } from '../api/dutchx'
import { State, Provider } from 'types'
import { ProviderName } from 'globals'
import { /* get, */ find, orderBy } from 'lodash'

export const selector = (state: State) => state.blockchain

/**
 * Finds a default provider from all currently available providers. Determined by provider integrations `priority`
 * @param {*} state - redux state
 */
// TODO: consider changing activeProvider dynamically in store on UPDATE_PROVIDER action
// that way we won't even need find/setActiveProvider in actions/blockchain
export const findDefaultProvider = (state: State) => {
  const providers = orderBy(state.blockchain.providers, ['priority'], ['desc'])

  return find(providers, {
    name: 'METAMASK',
    // loaded: true, available: true,
  })
}

export const getActiveProvider = (state: State): ProviderName => selector(state).activeProvider

export const getSelectedProvider = (state: State): Provider | null => (
  selector(state).providers !== undefined ? selector(state).providers[selector(state).activeProvider] : null
)

export const getDefaultAccount = (state: State) => selector(state).defaultAccount

export const getAccount = (state: State) => selector(state).currentAccount

// Default account balance
export const getCurrentBalance = (state: State) => selector(state).currentBalance
