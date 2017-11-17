import { connect } from 'react-redux'
import WalletPanel from 'components/WalletPanel'
// import { State } from 'types'

const mapStateToProps = () => ({
  // TODO: get address from store, populated by contract addresses
  auctionAddress: '0x03494929349594',
})


export default connect(mapStateToProps)(WalletPanel)
