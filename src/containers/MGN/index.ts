import { connect } from 'react-redux'

import { State } from 'types'

import MGN from 'components/MGN'

const mapState = ({ blockchain: { currentAccount , activeProvider, providers, network } }: State) => ({
  currentAccount,
  network,
  now: providers[activeProvider] ? providers[activeProvider].timestamp : null,
})

export default connect(mapState)(MGN)
