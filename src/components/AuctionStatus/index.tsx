import React from 'react'
import TokenClaimingHOC, { TokenClaimingState } from 'components/TokenClaimingHOC'

import { BigNumber, DefaultTokenObject } from 'types'
import { AuctionStatus as Status } from 'globals'

import claim from 'assets/claim.svg'
import { getTimingApproximations } from 'utils/timings'

export interface AuctionStatusProps {
  sellToken: DefaultTokenObject,
  buyToken: DefaultTokenObject,
  sellAmount: BigNumber,
  buyAmount: BigNumber,
  auctionStart: BigNumber,
  timeLeft: number,
  now: number,
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

const statusText: { [T in Status]: string } = {
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
      if (sellAmount.eq(0) || buyAmount.eq(0)) {
        return (
          <span>
            <big className="message">No funds to claim</big>
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

type ShowTimingProps = Pick<AuctionStatusProps, 'auctionStart' | 'status' | 'buyToken' | 'sellAmount' | 'now'>

const ShowTiming: React.SFC<ShowTimingProps> = ({ auctionStart, status, buyToken, sellAmount, now }) => {
  console.log('status: ', status)

  const timings = getTimingApproximations({ auctionStart, status, now })

  if (timings === null) return null

  const userParticipates = sellAmount.gt(0)

  const { willStart, willEnd, runFor, claim } = timings

  let auctionStr = 'The auction '
  if (willEnd === 'soon') auctionStr += `will end ${willEnd}`
  else if (willEnd) auctionStr += `is running and will end ${willEnd}`
  else if (willStart) {
    auctionStr += `will start ${willStart}`
    if (runFor) auctionStr += ` and run for ${runFor}`
  }

  const bToken = buyToken.symbol || buyToken.name || buyToken.address

  let claimStr
  if (userParticipates && claim && !willEnd) claimStr = `You may claim your ${bToken} ${claim}`

  return (
      <p>
        {auctionStr}
        <br/>
        <br/>
        {claimStr}
      </p>
  )
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

        <ShowStatusWithClaiming {...props} />
        <ShowTiming {...props} />
      </div>
  )
}

export default AuctionStatus
