import { connect } from 'react-redux'
import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair } from 'actions'
import { State } from 'types'

const defaultTokensSelector = (tokenList: State['tokenList']) => {
  const tokens = tokenList.type !== 'DEFAULT' ? tokenList.combinedTokenList : tokenList.defaultTokenList
  // console.log('LOCALFORAGE SELECTOR == ', tokens.elements.map(tok => tok.symbol))
  return tokens.map(tok => tok.symbol)
}

// TODO: consider grabbing tokenOverlay.mod from global state
const mapStateToProps = ({ tokenList, tokenBalances, tokenOverlay }: State) => ({
  tokenCodeList: defaultTokensSelector(tokenList),
  tokenBalances,
  ...tokenOverlay,
})

export default connect(mapStateToProps, { closeOverlay, selectTokenPairAndRatioPair })(TokenOverlay as any)
