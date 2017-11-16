import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionWalletSummary from 'containers/AuctionWalletSummary'
import ButtonCTA from 'components/ButtonCTA'
import TokenPair from 'containers/TokenPair'

interface WalletPanelProps {
  auctionAddress: string
}


const WalletPanel: React.SFC<WalletPanelProps> = ({ auctionAddress }) => (
  <AuctionContainer auctionDataScreen="details">
    <AuctionHeader backTo="/order">
      Confirm Order Details
      </AuctionHeader>
    <TokenPair />
    <AuctionPriceBar header="Price" />
    <AuctionWalletSummary />
    <p>
      When submitting the order and signing with MetaMask,
        your deposit will be added to the next (scheduled) auction. Every auction takes approx. 5 hours.
      </p>
    <ButtonCTA onClick={() => console.log('Submitting Order')} to={`/auction/${auctionAddress}`}>
      Submit Order <i className="icon icon-walletOK"></i>
    </ButtonCTA>
  </AuctionContainer>
)

export default WalletPanel
