/**
 * @typedef {object} Contract
 * @property {string} address
 * @property {string} creator
 * @property {number|string|BigNumber} creationBlock
 * @property {number|string|BigNumber} creationDate
 */
const Contract = {
  address: undefined,
  creator: undefined,
  creationBlock: undefined,
  creationDate: undefined,
}

/**
 * @typedef {Contract} Market
 * @property {boolean} local - Was only created in local redux state
 * @property {string[]} netOutcomeTokensSold - Number of tokens sold per outcome
 * @property {number|string|BigNumber} funding - Funding for market (used for creation)
 * @property {number|string|BigNumber} fee - Fee in percentage
 * @property {number} stage - Marketstage @see src/utils/constants MARKET_STAGES
 * @property {number|string|BigNumber} tradingVolume - Total amount of shares bought from this market
 * @property {Contract} marketMaker - Marketmaker used for trading LMSR
 * @property {Contract} marketFactory - Marketfactory used to create instances of markets
 */
const Market = {
  ...Contract,
  local: true,
  netOutcomeTokensSold: [],
  funding: '0',
  fee: '0',
  stage: 1,
  tradingVolume: '0',
  marketMaker: undefined,
  marketFactory: undefined,
}

/**
 * @typedef {Contract} Event
 * @property {boolean} local - Was only created in local redux state
 * @property {string} collateralToken - Address of collateralToken used to buy shares from this event (ETH hardcoded currently)
 * @property {boolean} isWinningOutcomeSet - Is the outcome for this event set (inside the Event Contract)?
 * @property {string} type - Type of outcome for this market @see src/utils/constants OUTCOME_TYPES
 * @property {number|string|BigNumber} lowerBound - Lowerbound for SCALAR_OUTCOME type outcomes
 * @property {number|string|BigNumber} upperBound - Upperbound for SCALAR_OUTCOME type outcomes
 */
const Event = {
  ...Contract,
  local: true,
  collateralToken: undefined,
  isWinningOutcomeSet: false,
  type: undefined,
  lowerBound: undefined,
  upperBound: undefined,
}

/**
 * @typedef {Contract} Oracle
 * @property {boolean} local - Was only created in local redux state
 * @property {boolean} isOutcomeSet - Is the outcome set inside the oracle contract? @see Event.isWinningOutcomeSet
 * @property {string} owner - Address of Oracleowner (resolver)
 */
const Oracle = {
  ...Contract,
  local: true,
  isOutcomeSet: false,
  owner: undefined,
}

/**
 * @typedef {object} EventDescription
 * @property {string} ipfsHash - IPFS Hash for this eventDescription object
 * @property {boolean} local - Was only created in local redux state, not fetched from a market yet if false
 * @property {string} title - Markettitle
 * @property {string} description - Marketdescription
 * @property {string} resolutionDate - ISO Date in UTC for Resolution
 */
const EventDescription = {
  ipfsHash: undefined,
  local: true,
  title: undefined,
  description: undefined,
  resolutionDate: undefined,
}

// Model Constructors

/**
 * Creates a new Event Description Object
 * @param {object|EventDescription} options - Eventdescription type object
 * @returns {EventDescription}
 */
export const createEventDescriptionModel = options => ({
  ...EventDescription,
  ...options,
})

/**
 * Creates a new Oracle Object
 * @param {object|Oracle} options - Oracle type object
 * @returns {Oracle}
 */
export const createOracleModel = options => ({
  ...Oracle,
  ...options,
})

/**
 * Creates a new Event Object
 * @param {object|Event} options - Event type object
 * @returns {Event}
 */
export const createEventModel = options => ({
  ...Event,
  ...options,
})

/**
 * Creates a new Market Object
 * @param {object|Market} options - Market type object
 * @returns {Market}
 */
export const createMarketModel = options => ({
  ...Market,
  ...options,
})
