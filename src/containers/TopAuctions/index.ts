import { connect } from 'react-redux'
import TopAuctions from 'components/TopAuctions'
import { selectTokenPair } from 'actions'
import { State, RatioPairs } from 'types'

import { createSelector } from 'reselect'


// TODO: move to selectors
// TODO: do comparison (+pairs[b] - +pairs[a]) with BigNumber.lt/gt/eq()
/**
 * sorts pairs by ASC and takes top 5
 * @param {typeof ratioPairs} pairs 
 * @returns {typeof ratioPairs}
 */
const getTop5Pairs = (pairs: RatioPairs) => pairs.slice()
  .sort((a, b) => +b.price - +a.price)
  .slice(0, 5)

const selectTop5Pairs = createSelector(
  ({ ratioPairs }) => ratioPairs,
  getTop5Pairs,
)

const mapStateToProps = (state: State) => ({
  pairs: selectTop5Pairs(state),
})

export default connect(mapStateToProps, { selectTokenPair })(TopAuctions)
