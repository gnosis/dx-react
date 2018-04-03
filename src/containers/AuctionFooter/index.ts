import { connect } from 'react-redux'
import AuctionFooter from 'components/AuctionFooter'
import { State } from 'types'

const mapStateToProps = ({ tokenPair: { sell, buy } }: State) => ({
  sellToken: sell,
  buyToken: buy,
  // TODO: get from redux store
  sellAmount: 1,
  buyAmount: 2.5520300,
  // TODO: compare with Status.ENDED
  auctionEnded: false,
})


export default connect(mapStateToProps)(AuctionFooter)
