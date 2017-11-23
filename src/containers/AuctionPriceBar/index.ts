import { connect } from 'react-redux'

import { State } from 'types'
import { findRatioPair } from 'selectors/ratioPairs'

import AuctionPriceBar from 'components/AuctionPriceBar'

// TODO: create state for lastAuctionPrice for each token
const mapState = (state: State) => {
  const { buy, sell, price } = findRatioPair(state) || Object.assign({ price: 2 }, state.tokenPair)

  return {
    sellToken: sell,
    sellTokenPrice: price,
    buyToken: buy,
  }
}

export default connect(mapState)(AuctionPriceBar)
