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
  timeLeft: number,
  status: Status,
  completed: boolean,
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
      if (sellAmount.eq(0)) { return (
        <span>
          <big>No funds to claim</big>
        </span>
      )
      }

      return (console.log((buyAmount.div(buyToken.decimals)).toFixed(4)),
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
          <h3>{buyToken.symbol || buyToken.name || buyToken.address} not yet claimable - please check back later</h3>
        </>
      )
    default:
      return null
  }
}

const ShowStatusWithClaiming = TokenClaimingHOC(ShowStatus)

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
    </div>
  )
}

export default AuctionStatus
