import React from 'react'

import { Balance } from 'types'

export interface AuctionPriceBarProps {
  buyTokenSymbol: string,
  header: string,
  sellTokenSymbol: string,
  sellTokenPrice: Balance,
}

const AuctionPriceBar: React.SFC<AuctionPriceBarProps> = ({ sellTokenSymbol, sellTokenPrice, buyTokenSymbol, header }) => {
  if (!sellTokenSymbol || !buyTokenSymbol) return null

  return (
    <div className="auctionLastPrice">
      <small>{`${header} of last auction:`}</small>
      {sellTokenSymbol && buyTokenSymbol && <big>{`1 ${sellTokenSymbol} = ${sellTokenPrice} ${buyTokenSymbol}`}</big>}
    </div>
  )
}

export default AuctionPriceBar
