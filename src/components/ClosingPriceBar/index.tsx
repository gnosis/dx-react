import React from 'react'

import { Balance, TokenCode } from 'types'

export interface ClosingPriceBarProps {
  sellToken: TokenCode,
  sellTokenPrice: Balance,
  buyToken: TokenCode,
}

const ClosingPriceBar: React.SFC<ClosingPriceBarProps> = ({ sellToken, sellTokenPrice, buyToken }) => 
  <div className="auctionLastPrice">
    <small>Closing price of last auction:</small>
    <big>{`1${sellToken} = ${sellTokenPrice} ${buyToken}`}</big>
  </div>

export default ClosingPriceBar
