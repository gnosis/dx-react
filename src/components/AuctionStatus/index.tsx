import React from 'react'

import { TokenCode, Balance } from 'types'

import claim from 'assets/claim.svg'

// TODO: move to global types
export enum Status {
  INIT = 'initialising',
  PLANNED = 'planned',
  ACTIVE = 'active',
  ENDED = 'ended',
}

export interface AuctionStatusProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
  buyAmount: Balance,
  timeLeft: string,
  status: Status
}

const capitalize = (str: string) => str && (str[0].toUpperCase() + str.slice(1))

const showStatus = ({ timeLeft, buyAmount, buyToken, status }: AuctionStatusProps) => {
  switch (status) {
    case Status.ACTIVE:
      return [
        <h5 key="0">ESTIMATED COMPLETION TIME</h5>,
        <i key="1">{timeLeft}</i>,
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
