import { connect } from 'react-redux'

import { State } from 'types'

import MenuAuctions, { MenuAuctionProps } from 'components/MenuAuctions'

const mapStateToProps = (state: State) => ({
  ongoingAuctions: state.blockchain.ongoingAuctions,
})

export default connect<MenuAuctionProps>(mapStateToProps, undefined)(MenuAuctions)
