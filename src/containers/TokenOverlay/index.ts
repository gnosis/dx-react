import { connect } from 'react-redux'

import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair } from 'actions'
import { State } from 'types'

const mapStateToProps = (state: State) => {
  const { tokenList, tokenPair, tokenBalances, tokenOverlay, approvedTokens, auctions } = state

  return {
    tokenList: tokenList.type !== 'DEFAULT' ?
      tokenList.combinedTokenList : tokenList.defaultTokenList,
    tokenPair,
    tokenBalances,
    ...tokenOverlay,
    approvedTokens,
    availableAuctions: auctions.availableAuctions,
  }
}

export default connect(mapStateToProps, {
  closeOverlay, selectTokenPairAndRatioPair,
})(TokenOverlay)
