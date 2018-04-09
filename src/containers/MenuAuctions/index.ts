import { connect } from 'react-redux'

import { State } from 'types'

// import OngoingAuctionsHOC from 'components/OngoingAuctionsHOC'
import MenuAuctions from 'components/MenuAuctions'

const mapStateToProps = (state: State) => ({
  ongoingAuctions: state.auctions.ongoingAuctions,
})

export default connect(mapStateToProps)(MenuAuctions)
