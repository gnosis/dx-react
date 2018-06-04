import React from 'react'
import { TokenCode, TokenName, Account, DefaultTokenObject } from 'types'
import { BigNumber } from 'bignumber.js'
import { AuctionStatus } from 'globals'
// import { promisedDutchX } from 'api/dutchx'
import {
  getLatestAuctionIndex,
  getClosingPrice,
  getPrice,
  getAuctionStart,
  getCurrentAccount,
  getTime,
  getSellerBalance,
  getUnclaimedSellerFunds,
  claimSellerFundsAndWithdraw,
} from 'api'

import { WATCHER_INTERVAL } from 'integrations/initialize'

// depends on router injecting match
export interface AuctionStateProps {
  match: {
    params: {
      index: string,
      buy: TokenCode | TokenName | Account,
      sell: TokenCode | TokenName | Account,
    },
    url: string,
  },
  tokenList: DefaultTokenObject[],
  address2Token: { [P in Account]: DefaultTokenObject },
  symbol2Token: { [P in TokenCode]: DefaultTokenObject },
}

export interface AuctionStateState {
  completed: boolean,
  status: AuctionStatus,
  sell: DefaultTokenObject,
  buy: DefaultTokenObject,
  price: number[],
  timeToCompletion: number,
  userSelling: BigNumber,
  userGetting:  BigNumber,
  userCanClaim: number,
  progress: number,
  index: number,
  account: Account,
  error: string,
}

interface AuctionStatusArgs {
  closingPrice: [BigNumber, BigNumber],
  index: number,
  currentAuctionIndex: BigNumber,
  auctionStart: BigNumber,
  now: number,
  price: [BigNumber, BigNumber],
}

const getAuctionStatus = ({
  closingPrice,
  index,
  currentAuctionIndex,
  auctionStart,
  price,
}: AuctionStatusArgs) => {
  console.log('closingPrice: ', closingPrice.map(n => n.toNumber()))
  console.log('index: ', index)
  console.log('currentAuctionIndex: ', currentAuctionIndex.toNumber())
  console.log('auctionStart: ', auctionStart.toNumber())
  console.log('price: ', price.map(n => n.toNumber()))
  if (closingPrice[1].gt(0) || currentAuctionIndex.greaterThan(index)) return AuctionStatus.ENDED
  // TODO: consider if (currentAuctionIndex < index && auction has sell volume) return AuctionStatus.PLANNED
  if (currentAuctionIndex.lessThan(index)) return AuctionStatus.PLANNED
  if (auctionStart.equals(1)) return AuctionStatus.INIT
  if (!price[1].equals(0)) return AuctionStatus.ACTIVE
  return AuctionStatus.INACTIVE
}

interface ProgressStepArgs {
  status: AuctionStatus,
  sellerBalance: BigNumber,
}
const getProgressStep = ({ status, sellerBalance }: ProgressStepArgs) => {
  if (sellerBalance.lte(0) || status === AuctionStatus.INACTIVE) return 0

  if (status === AuctionStatus.INIT || status === AuctionStatus.PLANNED) return 1

  if (status === AuctionStatus.ACTIVE) return 2

  if (status === AuctionStatus.ENDED) return 3

  return 0
}

export default (Component: React.ClassType<any, any, any>): React.ClassType<any, any, any> => {
  return class AuctionStateHOC extends React.Component<AuctionStateProps, AuctionStateState> {
    state = {} as AuctionStateState
    interval: number = null

    async componentDidMount() {
      if (await this.updateAuctionState()) {
        console.log('valid auction')
      } else {
        console.warn('invalid auction')
      }
      (window as any).updateAuctionState = this.updateAuctionState.bind(this)

      this.interval = window.setInterval(() => this.updateAuctionState(), WATCHER_INTERVAL)
    }

    async componentWillReceiveProps(nextProps: any) {
      if (nextProps.symbol2Token || nextProps.address2Token) return this.updateAuctionState()
    }

    async updateAuctionState() {
      const { match, address2Token, symbol2Token } = this.props
      const { sell, buy, index: indexParam } = match.params
      const index = +indexParam

      if (Number.isNaN(index) || index < 0 || !Number.isInteger(index)) {
        const error = `wrong index format: ${indexParam}`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      if (
        !address2Token[sell] && !address2Token[buy] &&
        !symbol2Token[sell] && !symbol2Token[buy]
      ) {
        const error = `${sell}->${buy} auction isn't supported in Frontend UI`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      const pair = {
        sell: address2Token[sell] || symbol2Token[sell],
        buy: address2Token[buy] || symbol2Token[buy],
      }

      const currentAuctionIndex = await getLatestAuctionIndex(pair)
      console.log('currentAuctionIndex: ', currentAuctionIndex.toNumber())

      if (currentAuctionIndex.equals(0)) {
        const error = `${sell}->${buy} auction hasn't run once yet`
        // TODO: display something and redirect to home?
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      if (currentAuctionIndex.lessThan(index - 1)) {
        const error = `auction index ${index} hasn't run yet nor is it scheduled to run next,
        current index = ${currentAuctionIndex.toNumber()}`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      const promisedAccount = getCurrentAccount()
      const [closingPrice, price, auctionStart, now] = await Promise.all([
        getClosingPrice(pair, index),
        getPrice(pair, index),
        getAuctionStart(pair),
        getTime(),
      ])

      const status = getAuctionStatus({
        closingPrice,
        price,
        auctionStart,
        now,
        index,
        currentAuctionIndex,
      })
      console.log('status: ', status)

      const account = await promisedAccount
      const sellerBalance = await getSellerBalance(pair, index, account)
      console.log('sellerBalance: ', sellerBalance.toString())

      // TODO: calculate differently for PLANNED auctions (currently is NaN)
      // ALSO: consider calculating not using price but rather sellerBalance/totalSellVolume*totalBuyVolume,
      // as price calculation returns a slightly larger figure than buyerVolume even (price is too optimistic)
      const userGetting = sellerBalance.mul(price[0]).div(price[1])

      const userCanClaim = sellerBalance.greaterThan(0) && closingPrice[0].greaterThan(0) ?
        (await getUnclaimedSellerFunds(pair, index, account)).toNumber() : 0

      const timeToCompletion = status === AuctionStatus.ACTIVE ? auctionStart.plus(86400 - now).mul(1000).toNumber() : 0

      const progress = getProgressStep({
        status,
        sellerBalance,
      })

      this.setState({
        completed: status === AuctionStatus.ENDED,
        status,
        sell: pair.sell,
        buy: pair.buy,
        price: price.map(n => n.toNumber()),
        timeToCompletion,
        userSelling: sellerBalance,
        userGetting,
        userCanClaim,
        progress,
        index,
        account,
        error: null,
      })

      return true
    }

    componentWillUnmount() {
      window.clearInterval(this.interval)
    }

    claimSellerFunds = () => {
      const { sell, buy, index, account, userCanClaim } = this.state
      
      console.log(
        `claiming tokens for ${account} for
        ${sell.symbol || sell.name || sell.address}->${buy.symbol || buy.name || buy.address}-${index}`,
      )
      return claimSellerFundsAndWithdraw({ sell, buy }, index, userCanClaim, account)
    }

    render() {
      // TODO: redirect home on invalid auction or something
      const { error } = this.state
      return (
        <div>
          {/* <pre style={{ position: 'fixed', zIndex: 2, opacity: 0.9 }}>
            {JSON.stringify(this.state, null, 2)}
          </pre> */}
          <Component {...this.props} {...this.state} claimSellerFunds={this.claimSellerFunds}/> :
          {error && <h3> Invalid auction: {error}</h3>}
        </div>
      )
    }
  }
}
