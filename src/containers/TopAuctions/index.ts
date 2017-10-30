import { connect } from 'react-redux'
import TopAuctions, { TopAuctionsProps } from 'components/TopAuctions'
import { State, RatioPairs } from 'types'

import { createSelector } from 'reselect'


// TODO: move to selectors
// TODO: do comparison (+pairs[b] - +pairs[a]) with BigNumber.lt/gt/eq()
/**
 * sorts pairs by ASC and takes top 5
 * @param {typeof ratioPairs} pairs 
 * @returns {typeof ratioPairs}
 */
const getTop5Pairs = (pairs: RatioPairs) => Object.keys(pairs)
  .sort((a, b) => +pairs[b] - +pairs[a])
  .slice(0, 5)
  .reduce((acc, pair) => (acc[pair] = pairs[pair], acc), {})

const selectTop5Pairs = createSelector(
  ({ ratioPairs }) => ratioPairs,
  getTop5Pairs,
)

const mapStateToProps = (state: State) => ({
  pairs: selectTop5Pairs(state),
})

export default connect<TopAuctionsProps>(mapStateToProps, null)(TopAuctions)
