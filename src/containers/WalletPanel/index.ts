import { connect, Dispatch } from 'react-redux'
import WalletPanel from 'components/WalletPanel'
// import { State } from 'types'
import { submitSellOrder } from 'actions'

const mapStateToProps = () => ({
  // TODO: get address from store, populated by contract addresses
  auctionAddress: '0x03494929349594',
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  submitOrder() {
    console.log('Submitting order')

    dispatch(submitSellOrder())
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(WalletPanel)
