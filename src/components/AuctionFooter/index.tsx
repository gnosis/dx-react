import React from 'react'
import { TokenCode } from 'types'

export interface AuctionFooterProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
  sellAmount: number,
  buyAmount: number,
  auctionEnded?: boolean
}

const AuctionFooter: React.SFC<AuctionFooterProps> = ({ auctionEnded, sellToken, buyToken, sellAmount, buyAmount }) => (
  <div className="auctionFooter">
    <span>
      <small>AMOUNT SELLING</small>
      <big>{sellAmount} {sellToken}</big>
    </span>
    <span>
      <small>{!auctionEnded && 'ESTIMATED'} GETTING TOTAL</small>
      <big>{buyAmount} {buyToken}</big>
    </span>
  </div>
)

export default AuctionFooter
