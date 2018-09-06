import { RatioPairs, DefaultTokenObject } from 'types'
import { createSelector } from 'reselect'

/**
 * sorts pairs by ASC and takes top 5
 * @param {typeof ratioPairs} pairs
 * @returns {typeof ratioPairs}
 */
// TODO: do comparison (+pairs[b] - +pairs[a]) with BigNumber.lt/gt/eq()
export const getTop5Pairs = (pairs: RatioPairs) => pairs.slice()
  .sort((a, b) => +b.price - +a.price)
  .slice(0, 5)

export const selectTop5Pairs = createSelector(
  ({ ratioPairs }) => ratioPairs,
  getTop5Pairs,
)

export const findRatioPair = createSelector(
  ({ tokenPair }) => tokenPair.sell,
  ({ tokenPair }) => tokenPair.buy,
  ({ ratioPairs }) => ratioPairs,
  (sell: DefaultTokenObject, buy: DefaultTokenObject, ratioPairs: RatioPairs) => ratioPairs.find(
    pair => pair.sell.address === sell.address && pair.buy.address === buy.address),
)
