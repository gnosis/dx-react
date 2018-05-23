import { connect } from 'react-redux'
import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair } from 'actions'
import { State } from 'types'

const mapStateToProps = ({ tokenList, tokenBalances, tokenOverlay }: State) => ({
  tokenList: tokenList.type !== 'DEFAULT' ? tokenList.combinedTokenList : tokenList.defaultTokenList,
  tokenBalances,
  ...tokenOverlay,
})

export default connect(mapStateToProps, {
  closeOverlay, selectTokenPairAndRatioPair
})(TokenOverlay)
