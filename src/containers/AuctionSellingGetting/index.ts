import { connect } from 'react-redux'
import { setSellTokenAmount } from 'actions'
import { getSellTokenBalance } from 'selectors'
import { EMPTY_TOKEN } from 'globals'

import { State } from 'types'
import AuctionSellingGetting, { AuctionSellingGettingProps } from 'components/AuctionSellingGetting'

const mapState = (state: State) => {
  // TODO: always have some price for every pair in RatioPairs
  const { sell = EMPTY_TOKEN, buy = EMPTY_TOKEN, lastPrice: price } = state.tokenPair
  const sellTokenBalance = getSellTokenBalance(state)
  const { sellAmount } = state.tokenPair
  const maxSellAmount = sellTokenBalance.div(10 ** sell.decimals)

  return ({
    // TODO: change prop to sellTokenBalance
    maxSellAmount,
    sellTokenSymbol: sell.symbol || sell.name || sell.address,
    buyTokenSymbol: buy.symbol || buy.name || buy.address,
    sellAmount,
    // TODO: use BN.mult()
    buyAmount: (+sellAmount * +price).toFixed(4),
  }) as AuctionSellingGettingProps
}

export default connect(mapState, { setSellTokenAmount })(AuctionSellingGetting)
