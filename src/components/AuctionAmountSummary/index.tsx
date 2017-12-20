import React from 'react'
import { TokenCode, Balance } from 'types'

export interface AuctionAmountSummaryProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
  sellTokenAmount: Balance,
  buyTokenAmount: Balance,
}

const AuctionAmountSummary: React.SFC<AuctionAmountSummaryProps> = ({
  sellToken, buyToken, sellTokenAmount, buyTokenAmount,
}) => (
    <div className="auctionAmountSummary">
      <span className="tokenItemSummary">
        <i data-coin={sellToken}></i>
        <big>SELLING</big>
        <p>{sellTokenAmount} {sellToken}</p>
      </span>

      <span className="tokenItemSummary">
        <i data-coin={buyToken}></i>
        <big>RECEIVING</big>
        <p>{buyTokenAmount} {buyToken}</p>
      </span>
    </div>
  )

export default AuctionAmountSummary
