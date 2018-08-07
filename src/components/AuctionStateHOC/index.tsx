import React from 'react'
import { TokenCode, TokenName, Account, DefaultTokenObject, TokenPair } from 'types'
import { BigNumber } from 'bignumber.js'
import { AuctionStatus } from 'globals'
import {
  getLatestAuctionIndex,
  getClosingPrice,
  getPrice,
  getAuctionStart,
  getCurrentAccount,
  getTime,
  getSellerBalance,
  getSellVolumeCurrent,
  getBuyVolume,
  getOutstandingVolume,
  getUnclaimedSellerFunds,
} from 'api'

import { toBN as toBigNumber } from 'web3-utils'

import { WATCHER_INTERVAL } from 'integrations/initialize'
import { shallowDifferent } from 'utils/helpers'

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
  claimSellerFundsAndWithdrawFromAuction(
    pair: TokenPair,
    index: number,
    amount: BigNumber,
    account: Account,
  ): void
}

export interface AuctionStateState {
  completed: boolean,
  theoreticallyCompleted: boolean,
  status: AuctionStatus,
  sell: DefaultTokenObject,
  buy: DefaultTokenObject,
  price: number[],
  closingPrice: number[],
  timeToCompletion: number,
  userSelling: BigNumber,
  userGetting:  BigNumber,
  userCanClaim: BigNumber,
  sellVolume: BigNumber,
  buyVolume: BigNumber,
  outstandingVolume: BigNumber,
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
  outstandingVolume: BigNumber,
}

const getAuctionStatus = ({
  closingPrice,
  index,
  currentAuctionIndex,
  auctionStart,
  price,
  outstandingVolume,
}: AuctionStatusArgs) => {
  console.log('closingPrice: ', closingPrice.map(n => n.toNumber()))
  console.log('index: ', index)
  console.log('currentAuctionIndex: ', currentAuctionIndex.toNumber())
  console.log('auctionStart: ', auctionStart.toNumber())
  console.log('price: ', price.map(n => n.toNumber()))
  if (closingPrice[1].gt(0) || currentAuctionIndex.gt(index)) return { status: AuctionStatus.ENDED }
  // this should show theoretically auctions as ENDED and allow to claim,
  // which internally closes the auction with a 0 buy order
  // TODO: consider if (currentAuctionIndex < index && auction has sell volume) return AuctionStatus.PLANNED
  if (currentAuctionIndex.lt(index)) return { status: AuctionStatus.PLANNED }

  if (auctionStart.equals(1)) return { status: AuctionStatus.INIT }

  if (currentAuctionIndex.equals(index) && closingPrice[0].equals(0) && outstandingVolume.eq(0)) {
    console.log('Theoretically closed')
    return { status: AuctionStatus.ENDED, theoretically: true }
  }

  if (!price[1].equals(0)) return { status: AuctionStatus.ACTIVE }

  return { status: AuctionStatus.INACTIVE }
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

      this.startWatching()
    }

    startWatching = () => this.interval = window.setInterval(() => this.updateAuctionState(), WATCHER_INTERVAL)

    stopWatching = () => window.clearInterval(this.interval)

    restartWatching = async (props = this.props) => {
      this.stopWatching()

      await this.updateAuctionState(props)

      this.startWatching()
    }

    async componentWillReceiveProps(nextProps: any) {
      if (shallowDifferent(nextProps.match.params, this.props.match.params)) {
        console.log('AUCTION PARAMS changed')
        return this.restartWatching(nextProps)
      }
      if (nextProps.symbol2Token || nextProps.address2Token) return this.updateAuctionState()
    }

    async updateAuctionState(props = this.props) {
      const { match, address2Token, symbol2Token } = props
      const { sell, buy, index: indexParam } = match.params
      const index = +indexParam

      if (Number.isNaN(index) || index < 0 || !Number.isInteger(index)) {
        const error = `Incorrect index format: ${indexParam}`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      if (
        (!symbol2Token[sell] || !symbol2Token[buy])
        &&
        (!address2Token[sell] || !address2Token[buy])
      ) {
        const error = `${sell} / ${buy} pairing is not supported in the Frontend UI, please try another token pairing.`
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
        const error = `${sell} / ${buy} token pair auction has not yet been initiated. Please try another token pairing.`
        // TODO: display something and redirect to home?
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      if (currentAuctionIndex.lessThan(index - 1)) {
        const error = `${sell} / ${buy} token pair auction @ index ${index} has not run yet.
        The current auction index for ${sell} / ${buy} is ${currentAuctionIndex.toNumber()}.`
        console.warn(error)
        this.setState({
          error,
        })
        return
      }

      const promisedAccount = getCurrentAccount()
      const [closingPrice, price, auctionStart, now, sellVolume, buyVolume] = await Promise.all([
        getClosingPrice(pair, index),
        getPrice(pair, index),
        getAuctionStart(pair),
        getTime(),
        getSellVolumeCurrent(pair),
        getBuyVolume(pair),
      ])
      const outstandingVolume = await getOutstandingVolume(pair, { price, sellVolume, buyVolume, auctionIndex: index })

      const { status, theoretically } = getAuctionStatus({
        closingPrice,
        price,
        auctionStart,
        now,
        index,
        currentAuctionIndex,
        outstandingVolume,
      })
      console.log('status: ', status)

      const account = await promisedAccount
      const sellerBalance = await getSellerBalance(pair, index, account)
      console.log('sellerBalance: ', sellerBalance.toString())

      // TODO: calculate differently for PLANNED auctions (currently is NaN)
      // ALSO: consider calculating not using price but rather sellerBalance/totalSellVolume*totalBuyVolume,
      // as price calculation returns a slightly larger figure than buyerVolume even (price is too optimistic)
      const userGetting = sellerBalance.mul(price[0]).div(price[1])

      let userCanClaim = sellerBalance.greaterThan(0) && closingPrice[0].gte(0) ?
        (await getUnclaimedSellerFunds(pair, index, account)) : toBigNumber(0)

        // if theoretically closed, then calculate differently as fraction of current volume
      if (theoretically) userCanClaim = buyVolume.div(sellVolume).mul(sellerBalance)

      const timeToCompletion = status === AuctionStatus.ACTIVE ? auctionStart.plus(86400 - now).mul(1000).toNumber() : 0

      const progress = getProgressStep({
        status,
        sellerBalance,
      })

      this.setState({
        completed: status === AuctionStatus.ENDED,
        theoreticallyCompleted: theoretically,
        status,
        sell: pair.sell,
        buy: pair.buy,
        price: price.map((n: BigNumber) => n.toNumber()),
        closingPrice: closingPrice.map((n: BigNumber) => n.toNumber()),
        timeToCompletion,
        userSelling: sellerBalance,
        userGetting,
        userCanClaim,
        sellVolume,
        buyVolume,
        outstandingVolume,
        progress,
        index,
        account,
        error: null,
      })

      return true
    }

    componentWillUnmount() {
      this.stopWatching()
    }

    claimSellerFunds = () => {
      const { sell, buy, index, account, userCanClaim, theoreticallyCompleted } = this.state
      //  withdraw reverts if amount < 0
      const amount = theoreticallyCompleted && userCanClaim.eq(0) ? userCanClaim.add(1) : userCanClaim

      console.log(
        `Claiming tokens to ${account} for
        ${sell.symbol || sell.name || sell.address}->${buy.symbol || buy.name || buy.address}-${index}`,
      )
      return this.props.claimSellerFundsAndWithdrawFromAuction({ sell, buy }, index, amount, account)
    }

    render() {
      // TODO: redirect home on invalid auction or something
      const { error } = this.state
      return (
        <div>
          <Component {...this.props} {...this.state} claimSellerFunds={this.claimSellerFunds}/> :
          {error && <h3> Invalid auction: {error}</h3>}
        </div>
      )
    }
  }
}
