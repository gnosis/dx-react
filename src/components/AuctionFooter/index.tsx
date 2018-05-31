import React from 'react'
import { BigNumber } from 'types'

export interface AuctionFooterProps {
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  sellAmount: BigNumber,
  buyAmount: BigNumber,
  sellDecimal: number,
  buyDecimal: number,
  auctionEnded?: boolean
}

const AuctionFooter: React.SFC<AuctionFooterProps> = ({ auctionEnded, sellTokenSymbol, buyTokenSymbol, sellAmount, buyAmount, sellDecimal, buyDecimal }) => (
  <div className="auctionFooter">
    <span>
      <small>AMOUNT SELLING</small>
      <big>{sellAmount.div(10 ** sellDecimal).toString()} {sellTokenSymbol}</big>
    </span>
    {buyAmount.gt(0) && <span>
      <small>{!auctionEnded && 'ESTIMATED'} GETTING TOTAL</small>
      <big>{buyAmount.div(10 ** buyDecimal).toString()} {buyTokenSymbol}</big>
    </span>}
  </div>
)

export default AuctionFooter
