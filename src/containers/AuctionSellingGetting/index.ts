import { connect } from 'react-redux'
import { setSellTokenAmount } from 'actions'
import { findRatioPair } from 'selectors/ratioPairs'

import { State } from 'types'
import AuctionSellingGetting, { AuctionSellingGettingProps } from 'components/AuctionSellingGetting'

const mapState = (state: State) => {
  // TODO: always have some price for every pair in RatioPairs
  const { sell, buy, price } = findRatioPair(state) || Object.assign({ price: 2 }, state.tokenPair)
  const { [sell.address]: sellTokenBalance } = state.tokenBalances
  const { sellAmount } = state.tokenPair

  return ({
    // TODO: change prop to sellTokenBalance
    sellTokenBalance,
    sellTokenSymbol: sell.symbol || sell.name || sell.address,
    buyTokenSymbol: buy.symbol || buy.name || buy.address,
    sellAmount,
    // TODO: use BN.mult()
    buyAmount: (+sellAmount * +price).toString(),
  }) as AuctionSellingGettingProps
}

export default connect(mapState, { setSellTokenAmount })(AuctionSellingGetting)
