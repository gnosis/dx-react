import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { State, RatioPairs, DefaultTokenObject } from 'types'
import AuctionAmountSummary from 'components/AuctionAmountSummary'

// TODO: move to selectors
const findRatioPair = createSelector(
  ({ tokenPair }) => tokenPair.sell,
  ({ tokenPair }) => tokenPair.buy,
  ({ ratioPairs }) => ratioPairs,
  (sell: DefaultTokenObject, buy: DefaultTokenObject, ratioPairs: RatioPairs) => ratioPairs.find(
    pair => pair.sell === sell && pair.buy === buy),
)

const mapState = (state: State) => {
  // TODO: always have some price for every pair in RatioPairs
  const { sell, buy, price } = findRatioPair(state) || Object.assign({ price: 2 }, state.tokenPair)
  const { sellAmount } = state.tokenPair
  return ({
    // TODO: change prop to sellTokenBalance
    sellToken: sell,
    buyToken: buy,
    sellTokenAmount: sellAmount,
    // TODO: use BN.mult() inside component
    buyTokenAmount: (+price * +sellAmount).toString(),
  })
}

export default connect(mapState)(AuctionAmountSummary)
