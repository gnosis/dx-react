import { connect } from 'react-redux'
import TokenPair from 'components/TokenPair'
import { openOverlay, swapTokensInAPair } from 'actions'
import { State } from 'types'

const mapStateToProps = ({
  tokenPair: { sell, buy },
  tokenBalances: { [sell]: sellTokenBalance = 0, [buy]: buyTokenBalance = 0 },
  ipfs: { fileHash },
  }: State) => ({
    sellToken: sell,
    buyToken: buy,
    sellTokenBalance,
    buyTokenBalance,
    fileHash,
  })


export default connect(mapStateToProps, { openOverlay, swapTokensInAPair })(TokenPair)
