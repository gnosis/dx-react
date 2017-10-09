import { get } from 'lodash'
import { entitySelector } from './entities'

export const getOracleByAddress = state => (eventOracleAddress) => {
  if (eventOracleAddress) {
    const oracleEntities = entitySelector(state, 'oracles')
    return get(oracleEntities, eventOracleAddress)
  }

  return undefined
}
