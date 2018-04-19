import React from 'react'

import { Balance, DefaultTokenObject } from 'types'

export interface AuctionPriceBarProps {
  buyToken: DefaultTokenObject,
  header: string,
  sellToken: DefaultTokenObject,
  sellTokenPrice: Balance,
}

const AuctionPriceBar: React.SFC<AuctionPriceBarProps> = ({ sellToken, sellTokenPrice, buyToken, header }) => 
  <div className="auctionLastPrice">
    <small>{`${header} of last auction:`}</small>
    <big>{`1 ${sellToken.symbol || sellToken.name || sellToken.address} = ${sellTokenPrice} ${buyToken.symbol || buyToken.name || buyToken.address}`}</big>
  </div>

export default AuctionPriceBar
