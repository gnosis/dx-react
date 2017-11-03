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

const AuctionStatus: React.SFC<AuctionStatusProps> = ({ sellToken, buyToken, buyAmount, timeLeft, status }) => (
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
      {
        status === Status.ACTIVE ? [
          <h5 key="1">ESTIMATED COMPLETION TIME</h5>,
          <i key="2">{timeLeft}</i>,
        ] : status === Status.ENDED ?
            <button id="claimToken">
              <i>CLAIM</i>
              <strong>{buyAmount} {buyToken}</strong>
              <span><img src={claim} /></span>
            </button> : null
      }
    </span>
  </div>
)

export default AuctionStatus
