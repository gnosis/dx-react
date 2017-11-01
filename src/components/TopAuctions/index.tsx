import React from 'react'
import { RatioPairs } from 'types'

export interface TopAuctionsProps {
  pairs: RatioPairs
}

const TopAuctions: React.SFC<TopAuctionsProps> = ({ pairs }) => (
  Object.keys(pairs).length > 0 &&
  <div className="topAuctions">
    <h3>HIGH VOLUME TOKEN PAIR AUCTIONS</h3>
    <ul>
      {pairs.map(({ sell, buy, price }) => {
        const pair = `${buy}/${sell}`
        return <li key={pair}><strong>{pair}</strong> {price}</li>
      })}
    </ul>
  </div>
)

export default TopAuctions
