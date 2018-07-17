import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { State } from 'types'

import MenuAuctions from 'components/MenuAuctions'
import { claimSellerFundsFromSeveral } from 'actions'

import { auctionClaimable } from 'selectors'

const mapStateToProps = (state: State) => ({
  ongoingAuctions: state.auctions.ongoingAuctions,
  claimable: auctionClaimable(state),
})

export default connect(mapStateToProps, { claimSellerFundsFromSeveral, push })(MenuAuctions)
