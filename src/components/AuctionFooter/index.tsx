import React from 'react'
import { DefaultTokenObject } from 'types'

export interface AuctionFooterProps {
  sellToken: DefaultTokenObject,
  buyToken: DefaultTokenObject,
  sellAmount: number,
  buyAmount: number,
  auctionEnded?: boolean
}

const AuctionFooter: React.SFC<AuctionFooterProps> = ({ auctionEnded, sellToken, buyToken, sellAmount, buyAmount }) => (
  <div className="auctionFooter">
    <span>
      <small>AMOUNT SELLING</small>
      <big>{sellAmount} {sellToken.symbol || sellToken.name || sellToken.address}</big>
    </span>
    <span>
      <small>{!auctionEnded && 'ESTIMATED'} GETTING TOTAL</small>
      <big>{buyAmount} {buyToken.symbol || buyToken.name || buyToken.address}</big>
    </span>
  </div>
)

export default AuctionFooter
