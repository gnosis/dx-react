import { connect } from 'react-redux'
import OrderPanel from 'components/OrderPanel'
import { State } from 'types'

const mapStateToProps = ({ tokenPair: { sell, buy, sellAmount } }: State) => ({
  sellTokenSymbol: sell.symbol || sell.name || sell.address,
  buyTokenSymbol: buy.symbol || buy.name || buy.address,
  sellAmount,
})


export default connect(mapStateToProps)(OrderPanel)
