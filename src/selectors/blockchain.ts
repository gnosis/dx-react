// import { getCurrentAccount } from '../api/dutchx'
import { State } from 'types'
import { /* get, */ find, orderBy } from 'lodash'
const Decimal = require('decimal.js')

interface Providers {
  [Providers: string]: any,
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

export const getSelectedProvider = (state: State): Providers | null => (
  selector(state).providers !== undefined ? selector(state).providers[selector(state).activeProvider] : null
)

export const getDefaultAccount = (state: State) => selector(state).defaultAccount

export const getAccount = (state: State) => selector(state).currentAccount

// Default account balance
export const getCurrentBalance = (state: State) => selector(state).currentBalance

// Checks GnosisJS initialization
export const isGnosisInitialized = (state: State) => selector(state).gnosisInitialized

export const getGasCosts = (state: State) => {
  const gasCosts = selector(state).gasCosts
  return Object.keys(gasCosts).reduce((acc, item) =>
    ({ ...acc, [item]: gasCosts[item] ? gasCosts[item] : new Decimal(0) }), {})
}

export const isGasCostFetched = (state: State, property: string) => selector(state).gasCosts[property] !== undefined

export const getGasPrice = (state: State) => (
  selector(state).gasPrice ? new Decimal(parseInt(selector(state).gasPrice, 10)) : new Decimal(0)
)

export const isGasPriceFetched = (state: State) => selector(state).gasPrice !== undefined

export const getEtherTokensAmount = (state: State, account: string) => {
  if (isGnosisInitialized(state)) {
    return selector(state).etherTokens !== undefined ? selector(state).etherTokens[account] : new Decimal(0)
  }
  return new Decimal(0)
}

export default {
  getDefaultAccount,
}
