import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { State, RatioPairs, TokenCode } from 'types'
import AuctionSellingGetting from 'components/AuctionSellingGetting'

// TODO: move to selectors
const findRatioPair = createSelector(
  ({ tokenPair }) => tokenPair.sell,
  ({ tokenPair }) => tokenPair.buy,
  ({ ratioPairs }) => ratioPairs,
  (sell: TokenCode, buy: TokenCode, ratioPairs: RatioPairs) => ratioPairs.find(
    pair => pair.sell === sell && pair.buy === buy),
)

const mapState = (state: State) => {
  const { sell, buy, price } = findRatioPair(state)
  const { [sell]: balance } = state.tokenBalances
  return ({
    // TODO: change prop to sellTokenBalance
    balance,
    sellToken: sell,
    buyToken: buy,
    // TODO: use BN.mult() inside component
    ratio: +price,
  })
}

export default connect(mapState)(AuctionSellingGetting)
