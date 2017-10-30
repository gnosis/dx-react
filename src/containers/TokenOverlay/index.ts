import { connect } from 'react-redux'
import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenAndCloseOverlay } from 'actions'
import { State } from 'types'

import { codeList } from 'globals'

const mapStateToProps = ({ tokenBalances, tokenOverlay: { open } }: State) => ({
  tokenCodeList: codeList,
  tokenBalances,
  open,
})

export default connect(mapStateToProps, { closeOverlay, selectTokenAndCloseOverlay })(TokenOverlay)
