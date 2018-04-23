import React from 'react'

export interface AuctionFooterProps {
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  sellAmount: number,
  buyAmount: number,
  auctionEnded?: boolean
}

const AuctionFooter: React.SFC<AuctionFooterProps> = ({ auctionEnded, sellTokenSymbol, buyTokenSymbol, sellAmount, buyAmount }) => (
  <div className="auctionFooter">
    <span>
      <small>AMOUNT SELLING</small>
      <big>{sellAmount} {sellTokenSymbol}</big>
    </span>
    <span>
      <small>{!auctionEnded && 'ESTIMATED'} GETTING TOTAL</small>
      <big>{buyAmount} {buyTokenSymbol}</big>
    </span>
  </div>
)

export default AuctionFooter
