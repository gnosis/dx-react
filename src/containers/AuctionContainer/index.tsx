import React from 'react'

export interface AuctionContainerProps {
  auctionDataScreen: string,
  children?: React.ReactNode[],
}

export const AuctionContainer: React.SFC<AuctionContainerProps> = ({ auctionDataScreen = 'details', children }) =>
  <section className="auction">
    <div className="auctionContainer" data-screen={auctionDataScreen}>
      {children}
    </div>
  </section>

export default AuctionContainer
