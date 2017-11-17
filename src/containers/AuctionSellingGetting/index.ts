import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { setSellTokenAmount } from 'actions'

import { State, RatioPairs, TokenCode } from 'types'
import AuctionSellingGetting, { AuctionSellingGettingProps } from 'components/AuctionSellingGetting'

// TODO: move to selectors
const findRatioPair = createSelector(
  ({ tokenPair }) => tokenPair.sell,
  ({ tokenPair }) => tokenPair.buy,
  ({ ratioPairs }) => ratioPairs,
  (sell: TokenCode, buy: TokenCode, ratioPairs: RatioPairs) => ratioPairs.find(
    pair => pair.sell === sell && pair.buy === buy),
)

const mapState = (state: State) => {
  // TODO: always have some price for every pair in RatioPairs
  const { sell, buy, price } = findRatioPair(state) || Object.assign({ price: 2 }, state.tokenPair)
  const { [sell]: sellTokenBalance } = state.tokenBalances
  const { sellAmount } = state.tokenPair

  return ({
    // TODO: change prop to sellTokenBalance
    sellTokenBalance,
    sellToken: sell,
    buyToken: buy,
    sellAmount,
    // TODO: use BN.mult()
    buyAmount: (+sellAmount * +price).toString(),
  }) as AuctionSellingGettingProps
}

export default connect(mapState, { setSellTokenAmount })(AuctionSellingGetting)
