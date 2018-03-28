import { connect } from 'react-redux'

// import { State } from 'types'

import OngoingAuctionsHOC from 'components/OngoingAuctionsHOC'
import MenuAuctions/*, { MenuAuctionProps }*/ from 'components/MenuAuctions'

// const mapStateToProps = (state: State) => ({
//   ongoingAuctions: state.blockchain.ongoingAuctions,
// })

export default connect()(OngoingAuctionsHOC(MenuAuctions))
