import React from 'react'
import { Link } from 'react-router-dom'

export interface AuctionHeaderProps {
  backTo?: string,
}

const AuctionHeader: React.SFC<AuctionHeaderProps> = ({ children, backTo }) => (
  <div className="auctionHeader">
    <h2>{children}</h2>
    {backTo && <Link className="buttonPrev" to={backTo} />}
  </div>
)

export default AuctionHeader
