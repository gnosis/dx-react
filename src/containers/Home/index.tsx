import { connect } from 'react-redux'
import { getActiveProvider } from 'selectors/blockchain'

import { State } from 'types'

import Home from 'components/Home'

const mapStateToProps = (state: State) => ({
  activeProvider: getActiveProvider(state),
})

export default connect(mapStateToProps)(Home as React.SFC)
