import { get } from 'lodash'
import { entitySelector } from './entities'

export const getEventDescriptionByAddress = state => (oracleEventDescriptionAddress) => {
  if (oracleEventDescriptionAddress) {
    const eventEntities = entitySelector(state, 'eventDescriptions')
    return get(eventEntities, oracleEventDescriptionAddress)
  }

  return undefined
}
