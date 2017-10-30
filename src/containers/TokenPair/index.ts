import { connect } from 'react-redux'
import TokenPair from 'components/TokenPair'
import { openOverlay } from 'actions'
import { State } from 'types'

const mapStateToProps = ({ tokenPair, tokenBalances }: State) => ({
  tokenPair,
  tokenBalances,
})


export default connect(mapStateToProps, { openOverlay })(TokenPair)
