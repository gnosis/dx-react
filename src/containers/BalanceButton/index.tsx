import { connect } from 'react-redux'
import BalanceButton from '../../components/BalanceButton'

import { getBalance } from '../../actions/Balance'

interface State {
  balance?: number,
  provider?: Object
}

interface Dispatch {
  dispatchGetBalance?: Function,
}

const mapStateToProps = (state: any):State => ({
  balance: state.balance.currentBalance,
  provider: state.blockchain.providers.METAMASK ? state.blockchain.providers.METAMASK.account : null,
})

const mapDispatchToProps = (dispatch: Function):Dispatch => ({
  dispatchGetBalance: (c: string, a: string) => dispatch(getBalance(c, a)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BalanceButton as any)
