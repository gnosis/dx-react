import { connect } from 'react-redux'
import TokenPair from 'components/TokenPair'
import { openOverlay, swapTokensInAPair } from 'actions'
import { State } from 'types'

const mapStateToProps = ({
  ipfs: { fileHash },
  tokenList: { defaultTokenList, customTokenList },
  tokenPair: { sell, buy },
  tokenBalances: { [sell]: sellTokenBalance = 0, [buy]: buyTokenBalance = 0 },
  }: State) => ({
    sellToken: sell,
    buyToken: buy,
    sellTokenBalance,
    buyTokenBalance,
    needsTokens: () => fileHash && defaultTokenList && customTokenList,
  })


export default connect(mapStateToProps, { openOverlay, swapTokensInAPair })(TokenPair)
