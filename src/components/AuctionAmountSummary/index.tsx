import React from 'react'
import { Balance } from 'types'
import { tokenSVG } from 'tokens'

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
        <i data-coin={tokenSVG.has(sellTokenSymbol) ? sellTokenSymbol : 'DEFAULT_TOKEN'}></i>
        <big>DEPOSITING</big>
        <p>{sellTokenAmount} {sellTokenSymbol}</p>
      </span>

      <span className="tokenItemSummary">
        <i data-coin={tokenSVG.has(buyTokenSymbol) ? buyTokenSymbol : 'DEFAULT_TOKEN'}></i>
        <big>RECEIVING (approx.)</big>
        <p>{buyTokenAmount} {buyTokenSymbol}</p>
      </span>
    </div>
  )

export default AuctionAmountSummary
