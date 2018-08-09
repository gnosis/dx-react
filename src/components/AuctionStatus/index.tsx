import React from 'react'
import TokenClaimingHOC, { TokenClaimingState } from 'components/TokenClaimingHOC'

import { BigNumber, DefaultTokenObject } from 'types'
import { AuctionStatus as Status } from 'globals'

import claim from 'assets/claim.svg'

export interface AuctionStatusProps {
  sellToken: DefaultTokenObject,
  buyToken: DefaultTokenObject,
  sellAmount: BigNumber,
  buyAmount: BigNumber,
  auctionStart: BigNumber,
  timeLeft: number,
  status: Status,
  completed: boolean,
  theoreticallyCompleted: boolean,
  claimSellerFunds: () => any,
}

// const getTimeStr = (timestamp: number) => {
//   const date = new Date(timestamp)
//   const hh = date.getUTCHours()
//   const mm = date.getUTCMinutes()
//   const ss = date.getUTCSeconds()

//   return `${hh ? `${hh} hour(s) ` : ''}${mm ? `${mm} minute(s) ` : ''}${ss ? `${ss} second(s) ` : ''}`
// }

const statusText: {[T in Status]: string} = {
  [Status.ACTIVE]: 'Ongoing',
  [Status.ENDED]: 'Ended',
  // WHAT should Status.INACTIVE be?
  [Status.INACTIVE]: 'Inactive ',
  [Status.INIT]: 'Not Started',
  [Status.PLANNED]: 'Not Started',
}

const translateStatus2Text = (str: string) => statusText[str] || str

const ShowStatus: React.SFC<AuctionStatusProps & TokenClaimingState & { claimTokens: () => {} }> = ({
  // timeLeft,
  sellAmount,
  buyAmount,
  buyToken,
  status,
  claimTokens,
  isClaiming,
}) => {
  switch (status) {
    case Status.ENDED:
      if (sellAmount.eq(0) || buyAmount.eq(0)) { return (
        <span>
          <big>No funds to claim</big>
        </span>
      )
      }

      return (
        <span>
          <button id="claimToken" onClick={claimTokens} disabled={isClaiming || !buyAmount}>
            <i>CLAIM</i>
            <strong>{(buyAmount.div(10 ** buyToken.decimals)).toFixed()} {buyToken.symbol || buyToken.name || buyToken.address}</strong>
            <span><img src={claim} /></span>
          </button>
        </span>
      )
    case Status.ACTIVE:
    case Status.PLANNED:
    case Status.INIT:
    // no deposit -- no button
      if (sellAmount.eq(0)) return null
      return (
        <>
          <span>
            <button id="claimToken" disabled>
              <i>CLAIM</i>
              <strong>{buyToken.symbol || buyToken.name || buyToken.address}</strong>
              <span><img src={claim} /></span>
            </button>
          </span>
        </>
      )
    default:
      return null
  }
}

const ShowStatusWithClaiming = TokenClaimingHOC(ShowStatus)

const AUCTION_RUN_TIME = 6.5 * 60 * 60 * 1000 // 6.5 hours in ms
const WAITING_PERIOD = 10 * 60 * 1000 // 10 min in ms

const getHhMm = (ms: number) => {
  const d = new Date(ms)
  return {
    h: d.getUTCHours(),
    m: d.getUTCMinutes(),
  }
}

const formatHours = ({ h, m }: { h: number, m: number }) => {
  let str = h.toString()
  if (m > 45) str = (h + 1) + ':00'
  else if (m > 30) str += ':45'
  else if (m > 15) str += ':30'
  else if (m > 0) str += ':15'
  else str += ':00'

  return str + 'h'
}

type ShowTimingProps = Pick<AuctionStatusProps, 'auctionStart' | 'status' | 'buyToken' | 'sellAmount'>

const ShowTiming: React.SFC<ShowTimingProps> = ({ auctionStart, status, buyToken, sellAmount }) => {
  // nothing for finished and inactive auctions
  if (status === Status.ENDED || status === Status.INACTIVE) return null

  const bToken = buyToken.symbol || buyToken.name || buyToken.address
  const userParticipates = sellAmount.gt(0)

  // auction is in 10 min waiting period
  if (auctionStart.eq(1) && status === Status.INIT) {
    return (
      <p>
        The auction will start soon and run for approx. 6 hours
        <br/>
        <br/>
        {userParticipates && `You may claim your ${bToken} in approx. 6 hours`}
      </p>
    )
  }

  const auctionStartMs = auctionStart.mul(1000)

  // index corresponds to an active auction
  if (status === Status.ACTIVE) {
    const timeSinceStart = Date.now() - auctionStartMs.toNumber()
    const { h: hoursSinceStart } = getHhMm(timeSinceStart)

    if (hoursSinceStart > 6) { return (
      <p>This auction will end soon</p>
    )
    }
    const timeTillEnd = AUCTION_RUN_TIME - timeSinceStart

    return (
      <p>This auction is running and will end in approx {formatHours(getHhMm(timeTillEnd))}</p>
    )
  }

  // index corresponds to a future auction
  if (status === Status.PLANNED) {
    const timeSinceStart = Date.now() - auctionStartMs.toNumber()
    const timeTillNext = auctionStartMs.add(AUCTION_RUN_TIME + WAITING_PERIOD).sub(Date.now()).toNumber()
    const claimableIn = timeTillNext + AUCTION_RUN_TIME

    if (timeSinceStart >= AUCTION_RUN_TIME) { return (
      <p>
        The auction will start soon and run for approx. 6 hours
        <br/>
        {userParticipates && `You may claim your ${bToken} in approx. 6:30 hours`}
      </p>
    )
    }

    return (
      <p>
        The auction will start in approx. {formatHours(getHhMm(timeTillNext))} and run for approx 6 hours
        <br/>
        {userParticipates && `You may claim your ${bToken} in approx. ${formatHours(getHhMm(claimableIn))}`}
      </p>
    )
  }

  return null
}

const AuctionStatus: React.SFC<AuctionStatusProps> = props => {
  const { sellToken, buyToken, status } = props

  return (
    <div className="auctionStatus">
      <span>
        <small>AUCTION</small>
        <big>
          {sellToken.symbol || sellToken.name || sellToken.address}
          /{buyToken.symbol || buyToken.name || buyToken.address}
        </big>
      </span>

      <span>
        <small>STATUS</small>
        <big data-status={status}>{translateStatus2Text(status)}</big>
      </span>

      <ShowStatusWithClaiming {...props}/>
      <ShowTiming {...props}/>
    </div>
  )
}

export default AuctionStatus
