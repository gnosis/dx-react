import React from 'react'
import { DefaultTokenObject, Balance } from 'types'

export interface AuctionAmountSummaryProps {
  sellToken: DefaultTokenObject,
  buyToken: DefaultTokenObject,
  sellTokenAmount: Balance,
  buyTokenAmount: Balance,
}

const AuctionAmountSummary: React.SFC<AuctionAmountSummaryProps> = ({
  sellToken, buyToken, sellTokenAmount, buyTokenAmount,
}) => (
    <div className="auctionAmountSummary">
      <span className="tokenItemSummary">
        <i data-coin={sellToken.symbol}></i>
        <big>SELLING</big>
        <p>{sellTokenAmount} {sellToken.symbol || sellToken.name || sellToken.address}</p>
      </span>

      <span className="tokenItemSummary">
        <i data-coin={buyToken.symbol}></i>
        <big>RECEIVING</big>
        <p>{buyTokenAmount} {buyToken.symbol || buyToken.name || buyToken.address}</p>
      </span>
    </div>
  )

export default AuctionAmountSummary
