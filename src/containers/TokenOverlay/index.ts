import { connect } from 'react-redux'

import TokenOverlay from 'components/TokenOverlay'
import { closeOverlay, selectTokenPairAndRatioPair, resetTokenPairAndCloseOverlay } from 'actions'
import { State, TokenCode } from 'types'
import { createSelector } from 'reselect'

const getTokenAddress = (code: TokenCode) => createSelector(
  ({ tokenList }) => tokenList.defaultTokenList,
  (defaultTokenList) => {
    const token = defaultTokenList.find((t: typeof defaultTokenList[0]) => t.symbol === code)
    return token && token.address
  },
)

const getWETHAddress = getTokenAddress('WETH')
const getMGNAddress = getTokenAddress('MGN')

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
    MGNAddress: getMGNAddress(state),
  }
}

export default connect(mapStateToProps, {
  closeOverlay, selectTokenPairAndRatioPair, resetTokenPairAndCloseOverlay,
})(TokenOverlay)
