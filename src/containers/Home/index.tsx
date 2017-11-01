import { connect } from 'react-redux'
import { getSelectedProvider } from 'selectors/blockchain'

import { State } from 'types'

import Home from 'components/Home'

const mapStateToProps = (state: State) => ({
  selectedProvider: getSelectedProvider(state),
})

export default connect(mapStateToProps)(Home as React.SFC)
