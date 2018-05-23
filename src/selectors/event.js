import { get } from 'lodash'
import { entitySelector } from './entities'

export const EVENT_TYPE_CATEGORICAL = 'CATEGORICAL'
export const EVENT_TYPE_SCALAR = 'SCALAR'
export const EVENT_TYPE_UNKNOWN = 'UNKNOWN'

export const getEventByAddress = state => (marketEventAddress) => {
  if (marketEventAddress) {
    const eventEntities = entitySelector(state, 'events')
    return get(eventEntities, marketEventAddress)
  }

  return undefined
}
