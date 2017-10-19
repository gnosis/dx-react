import { connect } from 'react-redux'
import BalanceButton from '../../components/BalanceButton'

import { getBalance } from '../../actions/Balance'

interface State {
  balance?: number,
  provider?: Object
}

const mapStateToProps = (state: any):State => ({
  balance: state.balance.currentBalance,
  provider: state.blockchain.activeProvider ? state.blockchain.activeProvider : null,
})

const mapDispatchToProps = {
  getBalance,
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceButton as any)
