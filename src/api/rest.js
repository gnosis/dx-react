import { restFetch, hexWithoutPrefix, addIdToObjectsInArray, getOutcomeName, normalizeScalarPoint } from 'utils/helpers'
import { normalize } from 'normalizr'
import { OUTCOME_TYPES } from 'utils/constants'

import sha1 from 'sha1'

import {
  marketSchema,
} from './schema'

const API_URL = `${process.env.GNOSISDB_URL}/api`

export const requestMarket = async marketAddress =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/`)
    .then(response => normalize(response, marketSchema))

export const requestMarkets = async () =>
  restFetch(`${API_URL}/markets/`)
    .then(response => normalize(
      response.results.filter(market => typeof market.funding !== 'undefined'),
      [marketSchema]),
    )

export const requestFactories = async () =>
  restFetch(`${API_URL}/factories`)

export const requestMarketShares = async (marketAddress, accountAddress) =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/shares/${hexWithoutPrefix(accountAddress)}/`)
    // unfortunately we need to return the shares as a market entity to be able to index on it
    // so we create an array for the market shares with the entities we receive here.
    .then((response) => {
      if (!response || (typeof response.count !== 'undefined' && response.count === 0)) {
        return []
      }

      return normalize({
        address: marketAddress,
        shares: response.results.map(share => ({
          id: sha1(`${accountAddress}-${share.outcomeToken.address}`), // unique identifier for shares
          event: share.outcomeToken.event,
          ...share,
        })),
      }, marketSchema)
    })

export const requestMarketParticipantTrades = async (marketAddress, accountAddress) =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(marketAddress)}/trades/${hexWithoutPrefix(accountAddress)}`)
    .then(response => addIdToObjectsInArray(response.results))


const transformMarketTrades = (trade, market) => (
  trade.marginalPrices.reduce((prev, current, outcomeIndex) => {
    const toReturn = { ...prev }
    toReturn[getOutcomeName(market, outcomeIndex)] = current
    return toReturn
  }, {
    date: trade.date,
    scalarPoint: OUTCOME_TYPES.SCALAR === market.event.type ?
      normalizeScalarPoint(trade.marginalPrices, market) : undefined,
  })
)

const getFirstGraphPoint = (market) => {
  let firstPoint
  if (OUTCOME_TYPES.SCALAR === market.event.type) {
    firstPoint = {
      date: market.creationDate,
      scalarPoint: normalizeScalarPoint(['0.5', '0.5'], market),
    }
  } else if (OUTCOME_TYPES.CATEGORICAL === market.event.type) {
    firstPoint = {
      date: market.creationDate,
      scalarPoint: undefined,
      ...market.eventDescription.outcomes.reduce((prev, current) => {
        const toReturn = {
          ...prev,
        }
        toReturn[current] = (1 / market.eventDescription.outcomes.length)
        return toReturn
      }, {}),
    }
  }
  return firstPoint
}

const getLastGraphPoint = trades => ({ ...trades[trades.length - 1], date: new Date().toISOString() })

export const requestMarketTrades = async market =>
  restFetch(`${API_URL}/markets/${hexWithoutPrefix(market.address)}/trades/`)
    .then((response) => {
      const trades = response.results.map(
        result => transformMarketTrades(result, market),
      )
      const firstPoint = getFirstGraphPoint(market)
      const lastPoint = trades.length ? getLastGraphPoint(trades) : { ...firstPoint, date: new Date().toISOString() }
      return [
        firstPoint,
        ...trades,
        lastPoint,
      ]
    })


export const requestAccountTrades = async address =>
  restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/trades/`)
    .then(response => response.results)

export const requestAccountShares = async address =>
  // restFetch(`${API_URL}/api/account/${hexWithoutPrefix(address)}/shares/`)
  //   .then(response => response.results)
  restFetch(`${API_URL}/account/${hexWithoutPrefix(address)}/shares/`)
  .then(response => response.results.map(
    (share) => {
      const s = { ...share }
      s.id = sha1(`${address}-${share.outcomeToken.address}`)
      return s
    },
  ))
