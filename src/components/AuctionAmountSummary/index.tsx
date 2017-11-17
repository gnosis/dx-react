import React from 'react'
import { TokenCode, Balance } from 'types'

export interface TokenPairProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
  sellTokenAmount: Balance,
  buyTokenAmount: Balance,
}

const TokenPair: React.SFC<TokenPairProps> = ({
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
        <big>BUYING</big>
        <p>{buyTokenAmount} {buyToken}</p>
      </span>
    </div>
  )

export default TokenPair
