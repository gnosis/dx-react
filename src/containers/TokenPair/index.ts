import { connect } from 'react-redux'
import TokenPair from 'components/TokenPair'
import { openOverlay, swapTokensInAPair } from 'actions'
import { State } from 'types'

const mapStateToProps = ({
  tokenList: { defaultTokenList, customTokenList, type },
  tokenPair: { sell, buy },
  tokenBalances: { [sell]: sellTokenBalance = 0, [buy]: buyTokenBalance = 0 },
  }: State) => ({
    sellToken: sell,
    buyToken: buy,
    sellTokenBalance,
    buyTokenBalance,
    needsTokens: type !== 'UPLOAD' || !(defaultTokenList.length > 0 || customTokenList.length > 0),
  })


export default connect(mapStateToProps, { openOverlay, swapTokensInAPair })(TokenPair)
