
export const RESOLUTION_TIME = {
  RELATIVE_FORMAT: 'y[Y] M[M] D[D] h[hrs] m[mins]',
  RELATIVE_LONG_FORMAT: 'y[ years] M[ months] D[ days] h[ hours] m[ minutes and] s[ seconds left]',
  ABSOLUTE_FORMAT: 'ddd, L LT',
}

export const OUTCOME_TYPES = {
  CATEGORICAL: 'CATEGORICAL',
  SCALAR: 'SCALAR',
}

export const ORACLE_TYPES = {
  ULTIMATE: 'ULTIMATE',
  CENTRALIZED: 'CENTRALIZED',
  BLOCK_DIFFICULTY: 'BLOCK_DIFFICULTY',
  REALITY_KEYS: 'REALITY_KEYS',
}

export const HEX_VALUE_REGEX = /(0x)?[0-9A-Fa-f]{40}/

export const COLOR_SCHEME_DEFAULT = [
  '#0be1b1', // green
  '#e01563', // red
  '#f2cc0a', // yellow
  '#9c8ae3', // lilac
  '#6f6f6f', // gray
  '#0abcf2', // blue
  '#f20ae0', // pink
  '#e4f20a', // orange
  '#73472c', // brown
]

export const SCALAR_SHORT_COLOR = COLOR_SCHEME_DEFAULT[0]
export const SCALAR_LONG_COLOR = COLOR_SCHEME_DEFAULT[2]

export const TRANSACTION_STATUS = {
  RUNNING: 'RUNNING',
  ERROR: 'ERROR',
  TIMEOUT: 'TIMEOUT',
  DONE: 'DONE',
}

export const TRANSACTION_COMPLETE_STATUS = {
  NO_ERROR: 'NO_ERROR',
  ERROR: 'ERROR',
  TIMEOUT: 'TIMEOUT',
}

export const GAS_COST = {
  MARKET_CREATION: 'market',
  BUY_SHARES: 'buyShares',
  SELL_SHARES: 'sellShares',
  RESOLVE_ORACLE: 'resolveOracle',
  WITHDRAW_FEES: 'withdrawFees',
  REDEEM_WINNINGS: 'redeemWinnings',
  CATEGORICAL_EVENT: 'categoricalEvent',
  SCALAR_EVENT: 'scalarEvent',
  CENTRALIZED_ORACLE: 'centralizedOracle',
  FUNDING: 'funding',
}
export const DEFAULT_NOTIFICATION_FADEOUT = 60000

export const MARKET_STAGES = {
  MARKET_CREATED: 0,
  MARKET_FUNDED: 1,
  MARKET_CLOSED: 2,
}

export const LOWEST_DISPLAYED_VALUE = 0.001
