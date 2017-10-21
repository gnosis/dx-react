import { connect } from 'react-redux'
import BalanceButton from '../../components/BalanceButton'

import { getBalance } from '../../actions/balance'

interface State {
  balance?: { currentBalance?: number },
  blockchain?: { activeProvider?: string },
}

interface StateToProps {
  currentBalance?: number,
  activeProvider?: string,
}

const mapStateToProps = (state: State): Object => ({
  balance: state.balance.currentBalance,
  provider: state.blockchain.activeProvider ? state.blockchain.activeProvider : null,
})

const mapDispatchToProps = {
  getBalance,
}

export default connect<StateToProps, Object, React.SFC<any>>(
  mapStateToProps, mapDispatchToProps)(BalanceButton as React.SFC,
)
