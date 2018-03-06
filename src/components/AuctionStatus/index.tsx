import React from 'react'
import TokenClaimingHOC, { TokenClaimingState } from 'components/TokenClaimingHOC'

import { TokenCode } from 'types'
import { AuctionStatus as Status } from 'globals'

import claim from 'assets/claim.svg'

export interface AuctionStatusProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
  buyAmount: number,
  timeLeft: number,
  status: Status,
  completed: boolean,
  index: number,
  account: string,
}

const getTimeStr = (timestamp: number) => {
  const date = new Date(timestamp)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = date.getUTCSeconds()

  return `${hh ? `${hh} hour(s) ` : ''}${mm ? `${mm} minute(s) ` : ''}${ss ? `${ss} second(s) ` : ''}`
}

const capitalize = (str: string) => str && (str[0].toUpperCase() + str.slice(1))

const ShowStatus: React.SFC<AuctionStatusProps & TokenClaimingState & { claimTokens: () => {} }> = ({
  timeLeft,
  buyAmount,
  buyToken,
  status,
  claimTokens,
  isClaiming,
}) => {
  switch (status) {
    case Status.ACTIVE:
      return (
        <span>
          <h5>ESTIMATED COMPLETION TIME</h5>
          <i>{getTimeStr(timeLeft)}</i>
        </span>
      )
    case Status.ENDED:
      return (
        <span>
          <button id="claimToken" onClick={claimTokens} disabled={isClaiming || !buyAmount}>
            <i>CLAIM</i>
            <strong>{buyAmount} {buyToken}</strong>
            <span><img src={claim} /></span>
          </button>
        </span>
      )
    default:
      return null
  }
}

const ShowStatusWithClaiming = TokenClaimingHOC(ShowStatus)

const AuctionStatus: React.SFC<AuctionStatusProps> = (props) => {
  const { sellToken, buyToken, status } = props

  return (
    <div className="auctionStatus">
      <span>
        <small>AUCTION</small>
        <big>{sellToken}/{buyToken}</big>
      </span>

      <span>
        <small>STATUS</small>
        <big data-status={status}>{capitalize(status)}</big>
      </span>

      <ShowStatusWithClaiming {...props}/>
    </div>
  )
}

export default AuctionStatus
