/* globals __ETHEREUM_HOST__ */

import Gnosis from '@gnosis.pm/gnosisjs'
import { requireEventFromTXResult } from '@gnosis.pm/gnosisjs/dist/utils'

import { hexWithPrefix, weiToEth } from 'utils/helpers'
import { OUTCOME_TYPES, ORACLE_TYPES } from 'utils/constants'
// import { normalize } from 'normalizr'

import delay from 'await-delay'
import moment from 'moment'
import Decimal from 'decimal.js'

let gnosisInstance

/**
 * Initializes connection to GnosisJS
 * @param {*dictionary} GNOSIS_OPTIONS
 */
export const initGnosisConnection = async (GNOSIS_OPTIONS) => {
  try {
    gnosisInstance = await Gnosis.create(GNOSIS_OPTIONS)
    console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  } catch (err) {
    console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
    console.error(err) // eslint-disable-line no-console
  }
}

/**
 * Returns an instance of the connection to GnosisJS
 */
export const getGnosisConnection = async () => gnosisInstance

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const gnosis = await getGnosisConnection()
  return await new Promise((resolve, reject) => gnosis.web3.eth.getAccounts(
    (e, accounts) => (e ? reject(e) : resolve(accounts[0]))),
  )
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account) => {
  const gnosis = await getGnosisConnection()
  return await new Promise((resolve, reject) => gnosis.web3.eth.getBalance(
    account,
    (e, balance) => (e ? reject(e) : resolve(weiToEth(balance.toString()))),
  ))
}

const normalizeEventDescription = (eventDescription, eventType) => {
  const eventDescriptionNormalized = {
    title: eventDescription.title,
    resolutionDate: eventDescription.resolutionDate,
    description: eventDescription.description,
  }
  if (eventType === OUTCOME_TYPES.CATEGORICAL) {
    eventDescriptionNormalized.outcomes = eventDescription.outcomes
  } else if (eventType === OUTCOME_TYPES.SCALAR) {
    eventDescriptionNormalized.decimals = parseInt(eventDescription.decimals, 10)
    eventDescriptionNormalized.unit = eventDescription.unit
  } else if (eventType === undefined) {
    throw new Error('Must pass eventType')
  }
  return eventDescriptionNormalized
}

export const createEventDescription = async (eventDescription, eventType) => {
  console.log('eventDescription', eventDescription)
  const eventDescriptionNormalized = normalizeEventDescription(eventDescription, eventType)
  const gnosis = await getGnosisConnection()
  // console.log(description)

  const ipfsHash = await gnosis.publishEventDescription(eventDescriptionNormalized)

  if (process.env.NODE_ENV !== 'production') {
    await delay(5000)
  }

  return {
    ipfsHash,
    local: true,
    ...eventDescriptionNormalized,
  }
}

export const createOracle = async (oracle) => {
  console.log('oracle', oracle)
  const gnosis = await getGnosisConnection()
  let oracleContract

  if (oracle.type === ORACLE_TYPES.CENTRALIZED) {
    oracleContract = await gnosis.createCentralizedOracle(oracle.eventDescription)
  } else if (oracle.type === ORACLE_TYPES.ULTIMATE) {
    // TODO: add remaining parameters and document
    oracleContract = await gnosis.createUltimateOracle(oracle)
  } else {
    throw new Error('invalid oracle type')
  }

  if (process.env.NODE_ENV !== 'production') {
    await delay(5000)
  }

  return {
    address: hexWithPrefix(oracleContract.address),
    owner: await getCurrentAccount(),
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    ...oracle,
  }
}

export const createEvent = async (event) => {
  console.log('event', event)
  const gnosis = await getGnosisConnection()

  let eventContract

  const eventData = {
    ...event,
    collateralToken: hexWithPrefix(gnosis.etherToken.address),
  }

  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    eventContract = await gnosis.createCategoricalEvent(eventData)
  } else if (event.type === OUTCOME_TYPES.SCALAR) {
    eventContract = await gnosis.createScalarEvent(eventData)
  } else {
    throw new Error('invalid outcome/event type')
  }

  if (process.env.NODE_ENV !== 'production') {
    await delay(5000)
  }

  return {
    address: hexWithPrefix(eventContract.address),
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    ...event,
    collateralToken: hexWithPrefix(gnosis.etherToken.address),
  }
}

export const createMarket = async (market) => {
  console.log('market', market)
  const gnosis = await getGnosisConnection()
  const fee = Decimal(market.fee).mul(10000).trunc().toString() // fee times 10000 as uint24

  const marketContract = await gnosis.createMarket({
    ...market,
    fee,
    marketMaker: gnosis.lmsrMarketMaker,
    marketFactory: gnosis.standardMarketFactory,
  })

  if (process.env.NODE_ENV !== 'production') {
    await delay(5000)
  }

  return {
    ...market,
    netOutcomeTokensSold: market.outcomes.map(() => '0'),
    funding: market.funding,
    creator: await getCurrentAccount(),
    creationDate: moment().format(),
    marketMaker: hexWithPrefix(gnosis.lmsrMarketMaker.address),
    marketFactory: hexWithPrefix(gnosis.standardMarketFactory.address),
    address: hexWithPrefix(marketContract.address),
    tradingVolume: '0',
    collectedFees: '0',
  }
}

export const fundMarket = async (market) => {
  console.log('funding', market)
  const gnosis = await getGnosisConnection()

  // this would be great:
  // await gnosis.approveToken(gnosis.etherToken.address, marketFunding.toString())
  // await gnosis.fundMarket(marketAddress, marketFunding)

  const marketContract = gnosis.contracts.Market.at(hexWithPrefix(market.address))
  const marketFunding = Decimal(market.funding)
  const marketFundingWei = marketFunding.times(1e18)

  await gnosis.etherToken.deposit({ value: marketFundingWei.toString() })
  await gnosis.etherToken.approve(hexWithPrefix(marketContract.address), marketFundingWei.toString())

  if (process.env.NODE_ENV !== 'production') {
    await delay(5000)
  }

  await marketContract.fund(marketFundingWei.toString())

  return market
}

/**
 * Closes a market
 * @param {*object} market
 */
export const closeMarket = async (market) => {
  const gnosis = await getGnosisConnection()
  const marketContract = gnosis.contracts.Market.at(hexWithPrefix(market.address))
  requireEventFromTXResult(await marketContract.close(), 'MarketClosing')

  if (process.env.NODE_ENV !== 'production') {
    await delay(5000)
  }

  return market
}

export const buyShares = async (market, outcomeTokenIndex, outcomeTokenCount, cost) => {
  const gnosis = await getGnosisConnection()

  // Markets on Gnosis has by default Ether Token as collateral Token, that has 18 decimals
  // Outcome tokens have also 18 decimals
  // The decimal values represent an offset of 18 positions on the integer value
  const collateralTokenWei = Decimal(cost).mul(1e18)

  // The user needs to deposit and approve the amount of collateral tokens willing to pay before performing the buy
  await gnosis.etherToken.deposit({ value: collateralTokenWei.toString() })
  await gnosis.etherToken.approve(hexWithPrefix(market.address), collateralTokenWei.toString())


  return await gnosis.buyOutcomeTokens({ market, outcomeTokenIndex, outcomeTokenCount: outcomeTokenCount.toString() })
}

export const resolveEvent = async (event, selectedOutcomeIndex) => {
  const gnosis = await getGnosisConnection()

  return await gnosis.resolveEvent(event.address, parseInt(selectedOutcomeIndex, 10))
}

export const sellShares = async (marketAddress, outcomeTokenIndex, outcomeTokenCount) => {
  const gnosis = await getGnosisConnection()

  const outcomeTokenCountWei = Decimal(outcomeTokenCount).mul(1e18).toString()

  return await gnosis.sellOutcomeTokens({
    market: hexWithPrefix(marketAddress),
    outcomeTokenIndex,
    outcomeTokenCount: outcomeTokenCountWei,
  })
}

export const redeemWinnings = async (eventType, eventAddress) => {
  const gnosis = await getGnosisConnection()

  const eventContract = eventType === OUTCOME_TYPES.CATEGORICAL ?
    await gnosis.contracts.CategoricalEvent.at(eventAddress) :
    await gnosis.contracts.ScalarEvent.at(eventAddress)

  if (eventContract) {
    return await eventContract.redeemWinnings()
  }
  throw new Error('Invalid Event - can\'t find the specified Event, invalid Eventtype?')
}

export const withdrawFees = async (marketAddress) => {
  const gnosis = await getGnosisConnection()

  const marketContract = gnosis.contracts.Market.at(marketAddress)

  if (marketContract) {
    return await marketContract.withdrawFees()
  }

  throw new Error('Invalid Market - can\'t find the specified Market')
}

export const calcLMSRCost = Gnosis.calcLMSRCost
export const calcLMSROutcomeTokenCount = Gnosis.calcLMSROutcomeTokenCount
export const calcLMSRMarginalPrice = Gnosis.calcLMSRMarginalPrice
export const calcLMSRProfit = Gnosis.calcLMSRProfit

/*
* Gas Calculation functions
*/
export const calcFundingGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return gnosis.contracts.Market.gasStats.fund.averageGasUsed
}

export const calcCategoricalEventGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return await gnosis.createCategoricalEvent.estimateGas({ marketFactory: gnosis.contracts.StandardMarketFactory, using: 'stats' })
}

export const calcScalarEventGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return await gnosis.createScalarEvent.estimateGas({ marketFactory: gnosis.contracts.StandardMarketFactory, using: 'stats' })
}

export const calcCentralizedOracleGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return await gnosis.createCentralizedOracle.estimateGas({ marketFactory: gnosis.contracts.StandardMarketFactory, using: 'stats' })
}

export const calcMarketGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return await gnosis.createMarket.estimateGas({ marketFactory: gnosis.contracts.StandardMarketFactory, using: 'stats' })
}

export const calcBuySharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return await gnosis.buyOutcomeTokens.estimateGas({ marketFactory: gnosis.contracts.StandardMarketFactory, using: 'stats' })
}

export const calcSellSharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  return await gnosis.sellOutcomeTokens.estimateGas({ marketFactory: gnosis.contracts.StandardMarketFactory, using: 'stats' })
}

/**
 * Returns the current gas price
 */
export const getGasPrice = async () => {
  const gnosis = await getGnosisConnection()
  return await new Promise(
    (resolve, reject) => gnosis.web3.eth.getGasPrice(
      (e, r) => (e ? reject(e) : resolve(r)),
    ),
  )
}

/**
 * Returns the amount of ether tokens
 * @param {*string} account address
 */
export const getEtherTokens = async (account) => {
  const gnosis = await getGnosisConnection()
  const balance = await gnosis.etherToken.balanceOf(account) // balance is a BigNumber
  return new Decimal(balance.toFixed(0))
}
