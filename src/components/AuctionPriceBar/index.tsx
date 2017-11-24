import React from 'react'

import { Balance, TokenCode } from 'types'

export interface AuctionPriceBarProps {
  buyToken: TokenCode,
  header: string,
  sellToken: TokenCode,
  sellTokenPrice: Balance,
}

const AuctionPriceBar: React.SFC<AuctionPriceBarProps> = ({ sellToken, sellTokenPrice, buyToken, header }) => 
  <div className="auctionLastPrice">
    <small>{`${header} of last auction:`}</small>
    <big>{`1 ${sellToken} = ${sellTokenPrice} ${buyToken}`}</big>
  </div>

export default AuctionPriceBar
