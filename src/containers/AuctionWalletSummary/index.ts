import { connect } from 'react-redux'

import { State } from 'types'
import AuctionWalletSummary from 'components/AuctionWalletSummary'

const mapState = ({ blockchain }: State) => {
  const { activeProvider, providers } = blockchain
  const currentProvider = providers[activeProvider]

  const { name: provider = '', account: address = '', network = '', loaded, available } = currentProvider

  return ({
    address,
    provider,
    network,
    connected: loaded && available,
  })
}

export default connect(mapState)(AuctionWalletSummary)
