import { connect } from 'react-redux'
import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair } from 'actions'
import { State } from 'types'

import { codeList } from 'globals'

// TODO: consider grabbing tokenOverlay.mod from global state
const mapStateToProps = ({ tokenBalances, tokenOverlay, approvedTokens }: State) => ({
  tokenCodeList: codeList,
  tokenBalances,
  ...tokenOverlay,
  approvedTokens,
})

export default connect(mapStateToProps, { closeOverlay, selectTokenPairAndRatioPair })(TokenOverlay)
