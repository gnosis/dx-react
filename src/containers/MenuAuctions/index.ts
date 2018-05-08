import { connect } from 'react-redux'

import { State } from 'types'

import MenuAuctions from 'components/MenuAuctions'
import { claimSellerFundsFromSeveral } from 'actions'

const mapStateToProps = (state: State) => ({
  ongoingAuctions: state.auctions.ongoingAuctions,
})

export default connect(mapStateToProps, { claimSellerFundsFromSeveral })(MenuAuctions)
