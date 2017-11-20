import { connect } from 'react-redux'
import TokenPair from 'components/TokenPair'
import { openOverlay } from 'actions'
import { State } from 'types'

const mapStateToProps = ({
  tokenPair: { sell, buy },
  tokenBalances: { [sell]: sellTokenBalance = 0, [buy]: buyTokenBalance = 0 },
  }: State) => ({
    sellToken: sell,
    buyToken: buy,
    sellTokenBalance,
    buyTokenBalance,
  })


export default connect(mapStateToProps, { openOverlay })(TokenPair)
