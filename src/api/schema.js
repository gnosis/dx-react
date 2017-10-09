import { schema } from 'normalizr'
import { mapValues } from 'lodash'

import { hexWithPrefix } from 'utils/helpers'

/**
 * Merges entity.contract into entity, discarding "contract" from the original entity
 * @param {object} entity
 */
const mergeContract = (entity) => {
  if (entity.contract) {
    const {
      contract: { creationBlock, creator, creationDate, address },
      ...entityWithoutContract
    } = entity

    return {
      address,
      creationBlock,
      creator,
      creationDate,
      ...entityWithoutContract,
    }
  }

  return entity
}

/**
 * Iterates over every field of the entity and normalizes hex values from "0xABC" to "ABC"
 * @param {object} entity
 */
const normalizeHexValues = entity => mapValues(entity, hexWithPrefix)

const NORMALIZE_OPTIONS_DEFAULT = {
  idAttribute: value => value.address || value.contract.address,
  processStrategy: entity => mergeContract(normalizeHexValues(entity)),
}

export const eventDescriptionSchema = new schema.Entity('eventDescriptions', {}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
  idAttribute: 'ipfsHash',
})

export const oracleSchema = new schema.Entity('oracles', {
  eventDescription: eventDescriptionSchema,
}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
})

export const eventSchema = new schema.Entity('events', {
  oracle: oracleSchema,
}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
})

export const marketSharesSchema = new schema.Entity('marketShares', {}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
  idAttribute: 'id',
})

export const marketSchema = new schema.Entity('markets', {
  event: eventSchema,
  shares: [marketSharesSchema],
}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
})

export const tradeSchema = new schema.Entity('trades', {}, {
  idAttribute: '_id',
})

