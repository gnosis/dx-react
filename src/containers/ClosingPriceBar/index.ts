import { connect } from 'react-redux'

import { State } from 'types'
import ClosingPriceBar from 'components/ClosingPriceBar'

// TODO: create state for lastAuctionPrice for each token
const mapState = ({ tokenPair }: State) => ({
  sellToken: tokenPair.sell,
  sellTokenPrice: '123',
  buyToken: tokenPair.buy,
})

export default connect(mapState)(ClosingPriceBar)
