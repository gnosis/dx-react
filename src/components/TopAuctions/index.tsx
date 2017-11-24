import React from 'react'
import { RatioPairs, TokenPair } from 'types'

export interface TopAuctionsProps {
  pairs: RatioPairs,
  selectTokenPairAndSetClosingPrice(pair: Pick<TokenPair, 'sell' | 'buy'>): any
}

const TopAuctions: React.SFC<TopAuctionsProps> = ({ pairs, selectTokenPairAndSetClosingPrice }) => (
  Object.keys(pairs).length > 0 &&
  <div className="topAuctions">
    <h3>HIGH VOLUME TOKEN PAIR AUCTIONS</h3>
    <ul>
      {pairs.map(({ sell, buy, price }) => {
        const pair = `${buy}/${sell}`
        return <li key={pair} onClick={() => selectTokenPairAndSetClosingPrice({ sell, buy })}><strong>{pair}</strong> {price}</li>
      })}
    </ul>
  </div>
)

export default TopAuctions
