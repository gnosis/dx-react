import { connect } from 'react-redux'
import OrderPanel from 'components/OrderPanel'
import { State, BigNumber } from 'types'
import { getSellTokenBalance } from 'selectors'
import { EMPTY_TOKEN } from 'globals';

const isTokenApproved = ({ approvedTokens, tokenPair: { sell = EMPTY_TOKEN, buy = EMPTY_TOKEN } }: State) =>
  approvedTokens.has(sell.address) && approvedTokens.has(buy.address)

const mapStateToProps = (state: State) => {
  const { tokenPair: { sell = EMPTY_TOKEN, buy = EMPTY_TOKEN, sellAmount } } = state
  console.log('sell: ', sell);
  const sellTokenBalance = getSellTokenBalance(state)
  console.log('sellTokenBalance: ', sellTokenBalance);
  // const { sellAmount } = state.tokenPair
  const maxSellAmount: BigNumber = sellTokenBalance.div(10 ** sell.decimals)
  console.log('maxSellAmount: ', maxSellAmount);

  return {
    sellTokenSymbol: sell.symbol || sell.name || sell.address,
    buyTokenSymbol: buy.symbol || buy.name || buy.address,
    validSellAmount: +sellAmount > 0 && maxSellAmount.greaterThanOrEqualTo(sellAmount),
    generatesMGN: isTokenApproved(state),
  }
}


export default connect(mapStateToProps)(OrderPanel)
