/* globals fetch */

import { mapValues, startsWith, isArray } from 'lodash'
import Decimal from 'decimal.js'
import { HEX_VALUE_REGEX, OUTCOME_TYPES } from 'utils/constants'

export const hexWithoutPrefix = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return startsWith(value, '0x') ? value.substring(2) : value
  }

  return value
}

/**
 * Adds the `0x` prefix to the incoming string value
 * @param {String} value
 */
export const add0xPrefix = value => startsWith(value, '0x') ? value : `0x${value}`

export const hexWithPrefix = value => HEX_VALUE_REGEX.test(value) ? add0xPrefix(value) : value

export const toEntity = (data, entityType, idKey = 'address') => {
  const { [idKey]: id, ...entityPayload } = mapValues(data, hexWithoutPrefix)

  return {
    entities: {
      [entityType]: {
        [id]: {
          [idKey]: id,
          ...entityPayload,
        },
      },
    },
    result: [
      id,
    ],
  }
}

/**
 * Converts a value from WEI to ETH
 * @param {String|Number} value
 */
export const weiToEth = (value) => {
  let ethValue = new Decimal(0)
  if (typeof value === 'string') {
    ethValue = new Decimal(value)
    if (ethValue.gt(0)) {
      return ethValue.div(1e18).toString()
    }
    return new Decimal(0).div(1e18).toString()
  }
  if (value instanceof Decimal && value.gt(0)) {
    return value.div(1e18).toString()
  }
  return ethValue.toString()
}

export const getOutcomeName = (market, index) => {
  let outcomeName
  if (!market.event) {
    return null
  }
  if (market.event.type === OUTCOME_TYPES.CATEGORICAL) {
    outcomeName = market.eventDescription.outcomes[index]
  } else if (market.event.type === OUTCOME_TYPES.SCALAR) {
    outcomeName = index === 0 ? 'Short' : 'Long'
  }
  return outcomeName
}

export const normalizeScalarPoint = (
  marginalPrices,
  { event: {
    lowerBound, upperBound,
  },
  eventDescription: { decimals },
}) => {
  const bigDecimals = parseInt(decimals, 10)

  const bigUpperBound = Decimal(upperBound).div(10 ** bigDecimals)
  const bigLowerBound = Decimal(lowerBound).div(10 ** bigDecimals)

  const bounds = bigUpperBound.sub(bigLowerBound)
  return Decimal(marginalPrices[1].toString()).times(bounds).add(bigLowerBound)
          .toDP(decimals)
          .toNumber()
}

/**
 * Adds _id incremental numeric property to each object in the array
 * @param { objects[] } arrayData
 */
export const addIdToObjectsInArray = (arrayData) => {
  arrayData.forEach((item, index) => {
    item._id = index
  })
  return arrayData
}

export const restFetch = url =>
  fetch(url)
    .then(res => new Promise((resolve, reject) => (res.status >= 400 ? reject(res.statusText) : resolve(res))))
    .then(res => res.json())
    .catch(err => new Promise((resolve, reject) => {
      console.warn(`Gnosis DB: ${err}`)
      reject(err)
    }))

export const bemifyClassName = (className, element, modifier) => {
  const classNameDefined = className || ''
  const classNames = isArray(classNameDefined) ? classNameDefined : classNameDefined.split(' ')

  if (classNames && classNames.length) {
    let classPath = ''

    if (element) {
      classPath += `__${element}`
    }
    if (element && modifier) {
      classPath += `--${modifier}`
    }

    return classNames.filter(s => s.length).map(cls => `${cls}${classPath}`).join(' ')
  }

  return ''
}

export const timeoutCondition = (timeout, rejectReason) => new Promise((_, reject) => {
  setTimeout(() => {
    reject(rejectReason)
  }, timeout)
})

/**
 * Determines if an account is a Moderator
 * @param {*string} accountAddress
 */
export const isModerator = accountAddress => (
  Object.keys(process.env.WHITELIST).length ? process.env.WHITELIST[accountAddress] !== undefined : false
)

export const getModerators = () => process.env.WHITELIST
