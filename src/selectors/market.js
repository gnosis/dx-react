import { get } from 'lodash'
import Decimal from 'decimal.js'

import { entitySelector } from './entities'
import { getEventByAddress } from './event'
import { getOracleByAddress } from './oracle'
import { getEventDescriptionByAddress } from './eventDescription'


export const getMarketById = state => (marketAddress) => {
  const marketEntities = entitySelector(state, 'markets')

  let market = {}
  if (marketEntities[marketAddress]) {
    const marketEntity = marketEntities[marketAddress]

    const marketEvent = getEventByAddress(state)(marketEntity.event)

    if (!marketEvent) {
      return market
    }

    const eventOracle = getOracleByAddress(state)(marketEvent.oracle)

    if (!eventOracle) {
      return market
    }

    const oracleEventDescription =
      getEventDescriptionByAddress(state)(eventOracle.eventDescription)

    if (!oracleEventDescription) {
      return market
    }

    market = {
      ...marketEntities[marketAddress],
      event: marketEvent,
      oracle: eventOracle,
      eventDescription: oracleEventDescription,
    }
  }

  return market
}

export const getMarketShareByShareId = state => (shareAddress) => {
  const marketShareEntities = entitySelector(state, 'marketShares')

  return marketShareEntities[shareAddress]
}

export const getMarkets = (state) => {
  const marketEntities = entitySelector(state, 'markets')

  return Object.keys(marketEntities).map(getMarketById(state))
}

export const getMarketSharesByMarket = state => (marketAddress) => {
  const marketEntity = getMarketById(state)(marketAddress)
  const shares = get(marketEntity, 'shares', [])

  return shares.map(shareAddress => getMarketShareByShareId(state)(shareAddress)).filter(share => share.balance > 0)
}

export const filterMarkets = state => (opts) => {
  const marketEntities = getMarkets(state)

  const { textSearch, resolved, onlyMyMarkets, onlyModeratorsMarkets, defaultAccount } = opts

  return marketEntities
    .filter(market =>
      (!textSearch ||
        market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1 ||
        market.eventDescription.title.toLowerCase().indexOf(textSearch.toLowerCase()) > -1) &&
      (!onlyMyMarkets || market.creator === defaultAccount.toLowerCase()) &&
      (!onlyModeratorsMarkets || process.env.WHITELIST[market.creator] !== undefined) &&
      (typeof resolved === 'undefined' || (resolved === 'RESOLVED' && market.oracle.isOutcomeSet) || (resolved === 'UNRESOLVED' && !market.oracle.isOutcomeSet)),
    )
}

/**
 * Sorts markets collection
 * @param {*} markets, array of market objects
 * @param {*} orderBy, orderBy criteria
 */
export const sortMarkets = (markets = [], orderBy = null) => {
  switch (orderBy) {
    case 'RESOLUTION_DATE_ASC':
      return markets.sort((a, b) => a.eventDescription.resolutionDate > b.eventDescription.resolutionDate)
    case 'RESOLUTION_DATE_DESC':
      return markets.sort((a, b) => a.eventDescription.resolutionDate < b.eventDescription.resolutionDate)
    case 'TRADING_VOLUME_ASC':
      return markets.sort((a, b) => a.tradingVolume > b.tradingVolume)
    case 'TRADING_VOLUME_DESC':
      return markets.sort((a, b) => a.tradingVolume < b.tradingVolume)
    default:
      return markets
  }
}

/**
 * Returns the array of a markets participant's related trades
 * @param {*} state
 */
export const getMarketParticipantsTrades = state => () => {
  const tradesArray = []
  const tradesObject = state.entities.trades
  if (tradesObject) {
    Object.keys(state.entities.trades).map(key => tradesArray.push(tradesObject[key]))
  }
  return tradesArray
}

/**
 * Returns the shares for the given account address
 * @param {*} state
 * @param {String} account, an address
 */
export const getAccountShares = (state, account) => {
  const accountShares = entitySelector(state, 'accountShares')
  return accountShares[account] ? accountShares[account].shares : []
}

/**
 * Returns the trades for the given account address
 * @param {*} state
 * @param {String} account, an address
 */
export const getAccountTrades = (state, account) => {
  const accountTrades = entitySelector(state, 'accountTrades')
  return accountTrades[account] ? accountTrades[account].trades : []
}

export const getAccountPredictiveAssets = (state, account) => {
  let predictiveAssets = new Decimal(0)

  if (account) {
    const shares = getAccountShares(state, account)
    if (shares.length) {
      predictiveAssets = shares.reduce(
        (assets, share) => assets.add(new Decimal(share.balance).mul(share.marginalPrice)), new Decimal(0),
      )
    }
  }
  return predictiveAssets
}

export const getAccountParticipatingInEvents = (state, account) => {
  const events = []

  if (account) {
    const shares = getAccountShares(state, account)

    if (shares.length) {
      shares.map((share) => {
        if (events.indexOf(share.outcomeToken.event) === -1) {
          events.push(share.outcomeToken.event)
        }
        return events
      })
    }
  }
  return events
}

export default {
  getMarkets,
}
