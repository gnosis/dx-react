import { connect } from 'react-redux'
import OrderPanel from 'components/OrderPanel'
import { State, BigNumber } from 'types'

const mapStateToProps = (state: State) => {
  const { tokenPair: { sell, buy, sellAmount } } = state
  const { [sell.address]: sellTokenBalance } = state.tokenBalances
  // const { sellAmount } = state.tokenPair
  const maxSellAmount: BigNumber = sellTokenBalance.div(10 ** sell.decimals)

  return {
    sellTokenSymbol: sell.symbol || sell.name || sell.address,
    buyTokenSymbol: buy.symbol || buy.name || buy.address,
    validSellAmount: +sellAmount > 0 && maxSellAmount.greaterThanOrEqualTo(sellAmount),
  }
}


export default connect(mapStateToProps)(OrderPanel)
