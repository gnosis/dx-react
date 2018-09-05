import { connect } from 'react-redux'

import { State } from 'types'

import AuctionPriceBar from 'components/AuctionPriceBar'
import { EMPTY_TOKEN } from 'globals'

// TODO: create state for lastAuctionPrice for each token
const mapState = (state: State) => {
  // TODO: change price acquisition
  const { buy = EMPTY_TOKEN, sell = EMPTY_TOKEN, lastPrice: price } = state.tokenPair

  return {
    sellTokenSymbol: sell.symbol || sell.name || sell.address,
    sellTokenPrice: price,
    buyTokenSymbol: buy.symbol || buy.name || buy.address,
  }
}

export default connect(mapState)(AuctionPriceBar)
