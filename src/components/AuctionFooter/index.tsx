import React from 'react'
import { BigNumber } from 'types'
import { AuctionStatus as Status } from 'globals'
import { Link } from 'react-router-dom'

export interface AuctionFooterProps {
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  sellAmount: BigNumber,
  buyAmount: BigNumber,
  sellDecimal: number,
  buyDecimal: number,
  auctionEnded?: boolean,
  status: Status,
}

const AuctionFooter: React.SFC<AuctionFooterProps> = ({
  // auctionEnded,
  sellTokenSymbol,
  // buyTokenSymbol,
  sellAmount,
  // buyAmount,
  sellDecimal,
  // buyDecimal,
  status,
}) => {
  if (status === Status.PLANNED || status === Status.INIT || status === Status.ACTIVE) {
    if (sellAmount.gt(0)) { return (
      <div className="auctionFooter">
        <span>
          <small>AMOUNT DEPOSITED</small>
          <big>{sellAmount.div(10 ** sellDecimal).toString()} {sellTokenSymbol}</big>
        </span>
      </div>
    )
    }

    return (
      <div className="auctionFooter">
        <span>
          <small>
            {status === Status.ACTIVE ? 'You are not taking part in this auction' : 'You have no deposit in this auction'}
          </small>
          <big><Link to="/">Take part in the {status === Status.ACTIVE ? 'next' : ''} auction</Link></big>
        </span>
      </div>
    )
  }

  if (status === Status.ENDED && sellAmount.gt(0)) { return (
    <div className="auctionFooter">
      <span>
        <small>AMOUNT SOLD</small>
        <big>{sellAmount.div(10 ** sellDecimal).toString()} {sellTokenSymbol}</big>
      </span>
    </div>
  )
  }


  return null
}

export default AuctionFooter
