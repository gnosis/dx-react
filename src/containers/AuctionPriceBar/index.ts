import { connect } from 'react-redux'

import { State } from 'types'
import { findRatioPair } from 'selectors/ratioPairs'

import AuctionPriceBar from 'components/AuctionPriceBar'

// TODO: create state for lastAuctionPrice for each token
const mapState = (state: State) => {
  // TODO: change price acquisition
  const { buy, sell, price } = findRatioPair(state) || Object.assign({ price: 2 }, state.tokenPair)

  return {
    sellTokenSymbol: sell.symbol || sell.name || sell.address,
    sellTokenPrice: price,
    buyTokenSymbol: buy.symbol || buy.name || buy.address,
  }
}

export default connect(mapState)(AuctionPriceBar)
