import React from 'react'
import { TokenCode, Balance } from 'types'
import { BigNumber } from 'bignumber.js'
import { code2tokenMap, AuctionStatus } from 'globals'
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
} from 'api'

// depends on router injecting match
export interface AuctionStateProps {
  match: {
    params: {
      index: string,
      buy: TokenCode,
      sell: TokenCode,
    },
  }
}

export interface AuctionStateState {
  completed: boolean,
  status: string,
  sell: TokenCode,
  buy: TokenCode,
  price: [BigNumber, BigNumber],
  timeToCompletion: number,
  userSelling: number,
  userGetting:  number,
  userCanClaim: number,
}

interface AuctionStatusArgs {
  closingPrice: [BigNumber, BigNumber],
  index: string,
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

export default (Component: React.ClassType<any, any, any>) => {
  return class extends React.Component<AuctionStateProps, AuctionStateState> {

    async componentDidMount() {
      if (await this.updateAuctionState()) {
        console.log('valid auction')
      } else {
        console.warn('invalid auction')
      }
      
    }

    async updateAuctionState() {
      const { sell, buy, index } = this.props.match.params

      if (!code2tokenMap[sell] || !code2tokenMap[buy]) {
        console.warn(`${sell}->${buy} auction isn't supported in Frontend UI`)
        return
      }

      const pair = { sell, buy }

      const currentAuctionIndex = await getLatestAuctionIndex(pair)
      console.log('currentAuctionIndex: ', currentAuctionIndex)

      if (currentAuctionIndex.equals(0)) {
        console.warn(`${sell}->${buy} auction hasn't run once yet`)
        // TODO: display something and redirect to home?
        return
      }

      if (!currentAuctionIndex.lessThan(index)) {
        console.warn(`auction index ${index} haven't run yet,\ncurrent index = ${currentAuctionIndex}`)
        return
      }

      const promisedAccount = getCurrentAccount()
      const [closingPrice, price, auctionStart, now] = await Promise.all([
        getClosingPrice(pair, +index),
        getPrice(pair, +index),
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
      const sellerBalance = await getSellerBalance(pair, +index, account)

      const userGetting = sellerBalance.mul(price[0]).div(price[1]).toNumber()

      const userCanClaim = sellerBalance.greaterThan(0) && closingPrice[0].greaterThan(0) ?
        (await getUnclaimedSellerFunds(pair, +index, account)).toNumber() : 0
      
      const timeToCompletion = status === AuctionStatus.ACTIVE ? auctionStart.plus(86500 - now).toNumber() : 0
      

      this.setState({
        completed: status === AuctionStatus.ENDED,
        status,
        sell,
        buy,
        price,
        timeToCompletion,
        userSelling: sellerBalance.toNumber(),
        userGetting,
        userCanClaim,
      })

      return true
    }

    render() {
      // TODO: redirect home on invalid auction or something
      return this.state.status ? <Component {...this.props} {...this.state}/> :
        <h3>Invalid auction</h3>
    }
  }
}
