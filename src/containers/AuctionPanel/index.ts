import { connect } from 'react-redux'
import AuctionPanel from 'components/AuctionPanel'
// import { State } from 'types'
import AuctionStateHOC from 'components/AuctionStateHOC'

const mapStateToProps = () => ({
  // TODO: get address from store, populated by contract addresses
  auctionAddress: '0x03494929349594',
})


export default connect(mapStateToProps)(AuctionStateHOC(AuctionPanel))
