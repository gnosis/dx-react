import { connect } from 'react-redux'

import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair, resetTokenPairAndCloseOverlay } from 'actions'
import { State } from 'types'
import { createSelector } from 'reselect'

const getWETHAddress = createSelector(
  ({ tokenList }) => tokenList.defaultTokenList,
  (defaultTokenList) => {
    const WETH = defaultTokenList.find((t: typeof defaultTokenList[0]) => t.symbol === 'WETH')
    return WETH && WETH.address
  },
)

const mapStateToProps = (state: State) => {
  const { tokenList, tokenPair, tokenBalances, tokenOverlay, approvedTokens, auctions } = state

  const { sell, buy } = tokenPair
  const hasPlaceholderToken = sell === undefined || buy === undefined

  return {
    tokenList: tokenList.type !== 'DEFAULT' ?
      tokenList.combinedTokenList : tokenList.defaultTokenList,
    tokenPair,
    resettable: !hasPlaceholderToken,
    tokenBalances,
    ...tokenOverlay,
    approvedTokens,
    availableAuctions: auctions.availableAuctions,
    WETHAddress: getWETHAddress(state),
  }
}

export default connect(mapStateToProps, {
  closeOverlay, selectTokenPairAndRatioPair, resetTokenPairAndCloseOverlay,
})(TokenOverlay)
