import { connect } from 'react-redux'
import AuctionStatus from 'components/AuctionStatus'
import { State } from 'types'

const mapStateToProps = ({ tokenPair: { sell, buy } }: State) => ({
  sellToken: sell,
  buyToken: buy,
  // TODO: get buyAmount based on what can be claimed, i.e. at the end of auction
  buyAmount: 2.5520300,
  // TODO: make sure time and status are populated in the store by DutchX
  timeLeft: 73414,
  status: 'initialising',
})


export default connect(mapStateToProps)(AuctionStatus)
