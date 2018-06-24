import React from 'react'
import { Balance } from 'types'

export interface AuctionAmountSummaryProps {
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  sellTokenAmount: Balance,
  buyTokenAmount: Balance,
}

const AuctionAmountSummary: React.SFC<AuctionAmountSummaryProps> = ({
  sellTokenSymbol, buyTokenSymbol, sellTokenAmount, buyTokenAmount,
}) => (
    <div className="auctionAmountSummary">
      <span className="tokenItemSummary">
        <i data-coin={sellTokenSymbol}></i>
        <big>SELLING</big>
        <p>{sellTokenAmount} {sellTokenSymbol}</p>
      </span>

      <span className="tokenItemSummary">
        <i data-coin={buyTokenSymbol}></i>
        <big>RECEIVING</big>
        <p>{buyTokenAmount} {buyTokenSymbol}</p>
      </span>
    </div>
  )

export default AuctionAmountSummary
