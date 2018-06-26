import { connect } from 'react-redux'
import TokenPair, { TokenPairProps } from 'components/TokenPair'
import { openOverlay, swapTokensInAPairAndReCalcClosingPrice, resetTokenPair } from 'actions'
import { State } from 'types'

const mapStateToProps = ({
  tokenList: { defaultTokenList, customTokenList, type },
  tokenPair: { sell, buy },
  tokenBalances: { [sell && sell.address]: sellTokenBalance = 0, [buy && buy.address]: buyTokenBalance = 0 },
  }: State) => ({
    sellToken: sell,
    buyToken: buy,
    sellTokenBalance,
    buyTokenBalance,
    needsTokens: type !== 'UPLOAD' || !(defaultTokenList.length > 0 || customTokenList.length > 0),
  })

interface ConnetedTokenPairProps {
  inHomePage?: boolean,
}

const mergeProps = (
  stateProps: Partial<TokenPairProps>,
  dispatchProps: Partial<TokenPairProps>,
  ownProps: ConnetedTokenPairProps,
) => {
  const { sellToken, buyToken } = stateProps
  const hasPlaceholderToken = sellToken === undefined || buyToken === undefined

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    resettable: ownProps.inHomePage && !hasPlaceholderToken,
  }
}

type DispatchProps = Pick<TokenPairProps, 'openOverlay' | 'swapTokensInAPairAndReCalcClosingPrice' | 'resetTokenPair'>

export default connect(
  mapStateToProps,
  { openOverlay, swapTokensInAPairAndReCalcClosingPrice, resetTokenPair } as DispatchProps,
  mergeProps,
)(TokenPair)
