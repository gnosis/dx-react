import Decimal from 'decimal.js'
import { normalize } from 'normalizr'
import uuid from 'uuid/v4'
import * as api from 'api'

import {
  receiveEntities,
  updateEntity,
} from 'actions/entities'

import {
  startLog,
  closeLog,
  closeEntrySuccess,
  closeEntryError,
} from 'actions/transactions'

import {
  createEventDescriptionModel,
  createOracleModel,
  createEventModel,
  createMarketModel,
} from 'api/models'

import {
  eventDescriptionSchema,
  eventSchema,
  oracleSchema,
  marketSchema,
} from 'api/schema'

import {
  OUTCOME_TYPES,
  TRANSACTION_COMPLETE_STATUS,
  MARKET_STAGES,
} from 'utils/constants'

/**
 * Constant names for marketcreation stages
 * @readonly
 * @enum {string}
 */
const TRANSACTION_STAGES = {
  EVENT_DESCRIPTION: 'eventDescription',
  ORACLE: 'oracle',
  EVENT: 'event',
  MARKET: 'market',
  FUNDING: 'funding',
  // Others
  GENERIC: 'generic',
}

/**
 * Stages for marketcreation
 */
const TRANSACTION_EVENTS = [
  {
    event: TRANSACTION_STAGES.EVENT_DESCRIPTION,
    label: 'Create Event Description',
  },
  {
    event: TRANSACTION_STAGES.ORACLE,
    label: 'Create Oracle',
  },
  {
    event: TRANSACTION_STAGES.EVENT,
    label: 'Create Event',
  },
  {
    event: TRANSACTION_STAGES.MARKET,
    label: 'Create Market',
  },
  {
    event: TRANSACTION_STAGES.FUNDING,
    label: 'Fund Market',
  },
]

/**
 * Generic Stage for single-event transactions
 */
const TRANSACTION_EVENTS_GENERIC = [
  {
    event: TRANSACTION_STAGES.GENERIC,
    label: 'Sending Transaction',
  },
]

/**
 * Requests details about a single market from GnosisDB.
 * @param {string} marketAddress - Markets Address
 */
export const requestMarket = marketAddress => async (dispatch) => {
  const payload = await api.requestMarket(marketAddress)
  return await dispatch(receiveEntities(payload))
}

/**
 * Requests all markets from GnosisDB.
 */
export const requestMarkets = () => async (dispatch) => {
  const payload = await api.requestMarkets()
  return await dispatch(receiveEntities(payload))
}

/**
 * Requests shares for a specific account on a market from GnosisDB.
 * @param {string} marketAddress - Market Address
 * @param {string} accountAddress - Shareowner Address
 */
export const requestMarketShares = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await api.requestMarketShares(marketAddress, accountAddress)
  return await dispatch(receiveEntities(payload))
}

/**
 * Requests factores (MarketFactory, EventFactory, etc) from GnosisDB.
 * @deprecated - Unused currently
 */
export const requestFactories = () => async (dispatch) => {
  const payload = await api.requestFactories()
  return await dispatch(receiveEntities(payload))
}

/**
 * Requests participating traders trades (tradehistory) for a specific account on a market from GnosisDB.
 * @param {string} marketAddress - Market Address
 * @param {string} accountAddress - Tradeowner Address
 */
export const requestMarketParticipantTrades = (marketAddress, accountAddress) => async (dispatch) => {
  const trades = await api.requestMarketParticipantTrades(marketAddress, accountAddress)
  return await dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: marketAddress,
      participantTrades: trades,
    },
  }))
}

/**
 * Requests all trades (tradehistory) on a market from GnosisDB.
 * @param {Market} market
 */
export const requestMarketTrades = market => async (dispatch) => {
  const trades = await api.requestMarketTrades(market)

  return await dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: market.address,
      trades,
    },
  }))
}

/**
 * Dispatches the shares for the given account address
 * @param {String} accountAddress
 */
export const requestAccountShares = accountAddress => async (dispatch) => {
  const shares = await api.requestAccountShares(accountAddress)
  return await dispatch(updateEntity({
    entityType: 'accountShares',
    data: {
      id: accountAddress,
      shares,
    },
  }))
}

/**
 * Dispatches the trades for the given account address
 * @param {String} accountAddress
 */
export const requestAccountTrades = accountAddress => async (dispatch) => {
  const trades = await api.requestAccountTrades(accountAddress)

  return await dispatch(updateEntity({
    entityType: 'accountTrades',
    data: {
      id: accountAddress,
      trades,
    },
  }))
}

/**
 * This function also has a sideeffect of adding to the TransactionLog.
 * Creates a market by running transaction in order for:
 *  - eventDescription
 *  - oracle
 *  - event
 *  - market
 * @param {object} options
 * @param {string} options.transactionId - ID to be used for transaction log
 * @param {object} options.eventDescription
 * @param {string} options.eventDescription.title - Markettitle
 * @param {string} options.eventDescription.description - Marketdescription Text
 * @param {object} options.oracle
 * @param {string} options.oracle.type - Type of Oracle to be used @see src/utils/constants ORACLE_TYPES
 * @param {object} options.event
 * @param {string} options.event.type - Type of Outcomes to be used @see src/utils/constants OUTCOME_TYPES
 * @param {number|string|BigNumber} options.event.lowerBound - Lower bound for OUTCOME_TYPES.SCALAR_OUTCOME
 * @param {number|string|BigNumber} options.event.upperBound - Upper bound for OUTCOME_TYPES.SCALAR_OUTCOME
 * @param {object} options.market
 * @param {number|string|BigNumber} options.market.funding - Initial funding for market in Ether
 * @param {number|string|BigNumber} options.market.fee - Marketfee in percentage (0 - 100, max 10 allowed in UI)
 */
export const createMarket = options => async (dispatch) => {
  const {
    eventDescription,
    oracle,
    event,
    market,
    transactionId,
  } = options

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS, `Creating Market "${eventDescription.title}"`))

  // Create Event Description
  let eventDescriptionContractData
  try {
    eventDescriptionContractData = await api.createEventDescription(eventDescription, event.type)

    await dispatch(receiveEntities(normalize(createEventDescriptionModel(eventDescriptionContractData), eventDescriptionSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.EVENT_DESCRIPTION))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.EVENT_DESCRIPTION, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  // Create Oracle
  let oracleContractData
  try {
    // Take from EventDescription
    oracle.eventDescription = eventDescriptionContractData.ipfsHash

    oracleContractData = await api.createOracle(oracle)
    await dispatch(receiveEntities(normalize(createOracleModel(oracleContractData), oracleSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.ORACLE))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.ORACLE, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  // Create Event
  let eventContractData
  try {
    // Take from Oracle
    event.oracle = oracleContractData.address

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      event.outcomeCount = (eventDescription.outcomes || []).length
    } else if (event.type === OUTCOME_TYPES.SCALAR) {
      event.lowerBound = Decimal(event.lowerBound).times(10 ** event.decimals).toString()
      event.upperBound = Decimal(event.upperBound).times(10 ** event.decimals).toString()
    }

    eventContractData = await api.createEvent(event)
    await dispatch(receiveEntities(normalize(createEventModel(eventContractData), eventSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.EVENT))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.EVENT, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }


  let marketContractData
  try {
    // Take from Event
    market.event = eventContractData.address

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      market.outcomes = eventDescription.outcomes
    } else if (event.type === OUTCOME_TYPES.SCALAR) {
      market.outcomes = [0, 1] // short, long
    }

    // Create Market
    marketContractData = await api.createMarket(market)
    await dispatch(receiveEntities(normalize(createMarketModel(marketContractData), marketSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.MARKET))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.MARKET, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  // Fund Market
  try {
    await api.fundMarket({
      ...marketContractData,
      funding: market.funding,
    })

    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.FUNDING))
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.FUNDING, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  await dispatch(closeLog(transactionId))
  return marketContractData
}

/**
 * Buy shares on specific market
 * @param {Market} market - Market to buy shares on
 * @param {number} outcomeIndex - Index of outcome to buy shares for
 * @param {number|string|BigNumber} outcomeTokenCount - Amount of tokenshares to buy
 * @param {number|string|BigNumber} cost - Max transaction cost allowed in Ether
 */
export const buyMarketShares = (market, outcomeIndex, outcomeTokenCount, cost) => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Buying Shares for "${market.eventDescription.title}"`))

  try {
    await api.buyShares(market, outcomeIndex, outcomeTokenCount, cost)
    await dispatch(closeEntrySuccess, transactionId, TRANSACTION_STAGES.GENERIC)
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  const netOutcomeTokensSold = market.netOutcomeTokensSold
  const newOutcomeTokenAmount = parseInt(netOutcomeTokensSold[outcomeIndex], 10) + outcomeTokenCount.toNumber()
  netOutcomeTokensSold[outcomeIndex] = newOutcomeTokenAmount.toString()

  await dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: market.address,
      netOutcomeTokensSold,
    },
  }))

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Sell shares on a specific market
 * @param {Market} market - Market to sell shares on
 * @param {number} outcomeIndex - Index of outcome to sell shares of
 * @param {number|string|BigNumber} outcomeTokenCount - Amount of tokenshares to sell
 */
export const sellMarketShares = (market, outcomeIndex, outcomeTokenCount) => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Selling Shares for "${market.eventDescription.title}"`))

  try {
    await api.sellShares(market.address, outcomeIndex, outcomeTokenCount)
    await dispatch(closeEntrySuccess, transactionId, TRANSACTION_STAGES.GENERIC)
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  // TODO: Calculate new shares
  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Resolve a markets oracle
 * @param {Market} market - Market to resolve the oracle of
 * @param {number|string} outcomeIndex - Winning Outcomes Index
 */
export const resolveMarket = (market, outcomeIndex) => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Resolving Oracle for "${market.eventDescription.title}"`))

  try {
    await api.resolveEvent(market.event, outcomeIndex)
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  await dispatch(updateEntity({ entityType: 'oracles', data: { id: market.oracle.address, isOutcomeSet: true, outcome: outcomeIndex } }))
  await dispatch(updateEntity({ entityType: 'events', data: { id: market.event.address, isWiningOutcomeSet: true } }))

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Redeem winnings of a market
 * @param {Market} market - Market to redeem winnings of
 */
export const redeemWinnings = market => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Redeeming Winnings for  "${market.eventDescription.title}"`))

  try {
    console.log('winnings: ', await api.redeemWinnings(market.event.type, market.event.address))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  // TODO: Update market so we can't redeem again

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Withdraw fees of a market
 * @param {Market} market - Market to withdraw fees of
 */
export const withdrawFees = market => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Withdrawing Fees for "${market.eventDescription.title}"`))

  try {
    console.log('fees: ', await api.withdrawFees(market.address))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  // TODO: Update market so we can't withdraw again

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

/**
 * Close a market
 * @param {Market} market - Market to close
 */
export const closeMarket = market => async (dispatch) => {
  const transactionId = uuid()

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_GENERIC, `Closing market "${market.eventDescription.title}"`))

  try {
    await api.closeMarket(market)
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.GENERIC))
  } catch (e) {
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.GENERIC, e))
    await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))

    throw e
  }

  const stage = MARKET_STAGES.MARKET_CLOSED
  await dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: market.address,
      stage,
    },
  }))

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}
