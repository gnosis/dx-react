import { connect } from 'react-redux'
import AuctionProgress from 'components/AuctionProgress'
// import { State } from 'types'
import { AuctionStatus as Status } from 'globals'

const status2progress = {
  [Status.INIT]: 1,
  [Status.PLANNED]: 2,
  [Status.ACTIVE]: 3,
  [Status.ENDED]: 4,
}

const getAuctionProgress = (status: Status) => status2progress[status] || 0

const mapStateToProps = () => ({
  // TODO: populate AuctionStatus in store by querying DutchX regularly or listening for Events
  progress: getAuctionProgress(Status.INIT),
})

export default connect(mapStateToProps)(AuctionProgress)
