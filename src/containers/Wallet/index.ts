import { connect } from 'react-redux'

import Wallet from 'components/Wallet'

const mapStateToProps = (state: any) => ({
  account: state.blockchain.currentAccount,
  balance: state.blockchain.currentBalance
})

export default connect(mapStateToProps)(Wallet)
