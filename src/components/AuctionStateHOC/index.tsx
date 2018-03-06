import React from 'react'
import { TokenCode } from 'types'
import { BigNumber } from 'bignumber.js'
import { code2tokenMap, AuctionStatus } from 'globals'
import {
  getLatestAuctionIndex,
  getClosingPrice,
  getPrice,
  getAuctionStart,
  getCurrentAccount,
  getTime,
  getSellerBalance,
  getUnclaimedSellerFunds,
} from 'api'

// depends on router injecting match
export interface AuctionStateProps {
  match: {
    params: {
      index: string,
      buy: TokenCode,
      sell: TokenCode,
    },
    url: string,
  }
}

export interface AuctionStateState {
  completed: boolean,
  status: AuctionStatus,
  sell: TokenCode,
  buy: TokenCode,
  index: number,
  price: number[],
  timeToCompletion: number,
  userSelling: number,
  userGetting:  number,
  userCanClaim: number,
  account: string,
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
  now,
  price,
}: AuctionStatusArgs) => {
  if (!closingPrice[1].equals(0)) return AuctionStatus.ENDED
  if (currentAuctionIndex.lessThan(index) && auctionStart.greaterThan(now)) return AuctionStatus.PLANNED
  if (auctionStart.equals(1)) return AuctionStatus.INIT
  if (!price[1].equals(0)) return AuctionStatus.ACTIVE
}

const UPDATE_INTERVAL = 3000

export default (Component: React.ClassType<any, any, any>): React.ClassType<any, any, any> => {
  return class AuctionStateUpdater extends React.Component<AuctionStateProps, AuctionStateState> {
    interval: number
    state = {} as AuctionStateState

    async componentDidMount() {
      if (await this.updateAuctionState()) {
        console.log('valid auction')
      } else {
        console.warn('invalid auction')
      }
      (window as any).updateAuctionState = this.updateAuctionState.bind(this)
      this.interval = window.setInterval(this.updateAuctionState.bind(this), UPDATE_INTERVAL)
    }

    componentWillUnmount() {
      window.clearInterval(this.interval)
    }

    async updateAuctionState() {
      const { sell, buy, index: indexParam } = this.props.match.params
      const index = +indexParam

      if (Number.isNaN(index) || index < 0 || !Number.isInteger(index)) {
        const error = `wrong index format: ${indexParam}`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      if (!code2tokenMap[sell] || !code2tokenMap[buy]) {
        const error = `${sell}->${buy} auction isn't supported in Frontend UI`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      const pair = { sell, buy }

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

      const account = await promisedAccount
      const sellerBalance = await getSellerBalance(pair, index, account)

      // TODO: calculate differently for PLANNED auctions (currently is NaN)
      // ALSO: consider calculating not using price but rather sellerBalance/totalSellVolume*totalBuyVolume,
      // as price calculation returns a slightly larger figure than buyerVolume even (price is too optimistic)
      const userGetting = sellerBalance.mul(price[0]).div(price[1]).toNumber()

      const userCanClaim = sellerBalance.greaterThan(0) && closingPrice[0].greaterThan(0) ?
        (await getUnclaimedSellerFunds(pair, index, account)).toNumber() : 0
      
      const timeToCompletion = status === AuctionStatus.ACTIVE ? auctionStart.plus(86400 - now).mul(1000).toNumber() : 0
      

      this.setState({
        completed: status === AuctionStatus.ENDED,
        status,
        sell,
        buy,
        index,
        price: price.map(n => n.toNumber()),
        timeToCompletion,
        userSelling: sellerBalance.toNumber(),
        userGetting,
        userCanClaim,
        account,
        error: null,
      })

      return true
    }

    render() {
      // TODO: redirect home on invalid auction or something
      const { error } = this.state
      return (
        <div>
          <pre style={{ position: 'fixed', zIndex: 2, opacity: 0.9 }}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
          <Component {...this.props} {...this.state}/>
          {error && <h3> Invalid auction: {error}</h3>}
        </div>
      )
    }
  }
}
