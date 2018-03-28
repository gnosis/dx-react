import React from 'react'

import { TokenCode } from 'types'
import { AuctionStatus as Status } from 'globals'

import claim from 'assets/claim.svg'

export interface AuctionStatusProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
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

const showStatus = ({ timeLeft, buyAmount, buyToken, status }: AuctionStatusProps) => {
  switch (status) {
    case Status.ACTIVE:
      return [
        <h5 key="0">ESTIMATED COMPLETION TIME</h5>,
        <i key="1">{getTimeStr(timeLeft)}</i>,
      ]
    case Status.ENDED:
      return (
        <button id="claimToken">
          <i>CLAIM</i>
          <strong>{buyAmount} {buyToken}</strong>
          <span><img src={claim} /></span>
        </button>
      )
    default:
      return null
  }
}

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

      <span>
        {showStatus(props)}
      </span>
    </div>
  )
}

export default AuctionStatus
