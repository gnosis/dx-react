import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionFooter from 'containers/AuctionFooter'
import AuctionHeader from 'components/AuctionHeader'
import AuctionProgress from 'containers/AuctionProgress'
import AuctionStatus from 'containers/AuctionStatus'

import BuyButton from 'components/BuyButton'

interface AuctionPanelProps {
  auctionAddress: string
}

const AuctionPanel: React.SFC<AuctionPanelProps> = ({ auctionAddress }) => (
  <AuctionContainer auctionDataScreen="status">
    <AuctionHeader backTo="/wallet">
      {/* TODO: grab auction address for url */}
      Auction URL: <a href="#">https://www.dutchx.pm/auction/{auctionAddress}/</a>
    </AuctionHeader>
    <AuctionStatus />
    <BuyButton />
    <AuctionProgress />
    <AuctionFooter />
  </AuctionContainer>
)

export default AuctionPanel
