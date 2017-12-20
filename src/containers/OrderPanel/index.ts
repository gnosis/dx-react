import { connect } from 'react-redux'
import OrderPanel from 'components/OrderPanel'
import { State } from 'types'

const mapStateToProps = ({ tokenPair: { sell, buy, sellAmount } }: State) => ({
  sellToken: sell,
  buyToken: buy,
  sellAmount,
})


export default connect(mapStateToProps)(OrderPanel)
