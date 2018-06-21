import { connect } from 'react-redux'

import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair } from 'actions'
import { State } from 'types'
import { createSelector } from 'reselect';

const getWETHAddress = createSelector(
  ({ tokenList }) => tokenList.defaultTokenList,
  (defaultTokenList) => {
    const WETH = defaultTokenList.find((t: typeof defaultTokenList[0]) => t.symbol === 'WETH')
    return WETH && WETH.address
  }
)

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
    WETHAddress: getWETHAddress(state),
  }
}

export default connect(mapStateToProps, {
  closeOverlay, selectTokenPairAndRatioPair,
})(TokenOverlay)
