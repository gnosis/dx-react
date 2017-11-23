import { connect } from 'react-redux'

import { State } from 'types'
import AuctionPriceBar from 'components/AuctionPriceBar'

// TODO: create state for lastAuctionPrice for each token
const mapState = (state: State) => {
  const ratioPairSelector: any = state.ratioPairs.find((pair: any) => 
    (pair.sell === state.tokenPair.sell && pair.buy === state.tokenPair.buy))
    
  return {
    sellToken: state.tokenPair.sell,
    sellTokenPrice: ratioPairSelector.price,
    buyToken: state.tokenPair.buy,
  }
}

export default connect(mapState)(AuctionPriceBar)
