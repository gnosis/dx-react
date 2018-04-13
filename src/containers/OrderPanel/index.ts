import { connect } from 'react-redux'
import OrderPanel from 'components/OrderPanel'
import { State } from 'types'

const isTokenApproved = ({ approvedTokens, tokenPair: { sell, buy } }: State) =>
  approvedTokens.has(sell) && approvedTokens.has(buy)

const mapStateToProps = (state: State) => {
  const { tokenPair: { sell, buy, sellAmount } } = state

  return {
    sellToken: sell,
    buyToken: buy,
    sellAmount,
    generatesMGN: isTokenApproved(state),
  }
}


export default connect(mapStateToProps)(OrderPanel)
