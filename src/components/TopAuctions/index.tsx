import React from 'react'

interface TopAuctionsProps {
  pairs: { [pair: string]: number }
}

const TopAuctions: React.SFC<TopAuctionsProps> = ({ pairs }) => (
  <div className="topAuctions">
    <h3>HIGH VOLUME TOKEN PAIR AUCTIONS</h3>
    <ul>
      {Object.keys(pairs).map(pair => (
        <li key={pair}><strong>{pair}</strong> {pairs[pair]}</li>
      ))}
    </ul>
  </div>
)

export default TopAuctions
