import { connect } from 'react-redux'
import OrderPanel from 'components/OrderPanel'
import { State } from 'types'

const mapStateToProps = ({ tokenPair: { sell, buy } }: State) => ({
  sellToken: sell,
  buyToken: buy,
})


export default connect(mapStateToProps)(OrderPanel)
