import React from 'react'
import TokenClaimingHOC, { TokenClaimingState } from 'components/TokenClaimingHOC'

import { DefaultTokenObject } from 'types'
import { AuctionStatus as Status } from 'globals'

import claim from 'assets/claim.svg'

export interface AuctionStatusProps {
  sellToken: DefaultTokenObject,
  buyToken: DefaultTokenObject,
  buyAmount: number,
  timeLeft: number,
  status: Status
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
      return [
        <h5 key="0">ESTIMATED COMPLETION TIME</h5>,
        <i key="1">{getTimeStr(timeLeft)}</i>,
      ] as any
    case Status.ENDED:
      return (
        <span>
          <button id="claimToken" onClick={claimTokens} disabled={isClaiming || !buyAmount}>
            <i>CLAIM</i>
            <strong>{buyAmount} {buyToken.symbol || buyToken.name || buyToken.address}</strong>
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
        <big>
          {sellToken.symbol || sellToken.name || sellToken.address}
          /{buyToken.symbol || buyToken.name || buyToken.address}
        </big>
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
