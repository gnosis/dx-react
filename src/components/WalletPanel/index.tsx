import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionWalletSummary from 'containers/AuctionWalletSummary'
import ButtonCTA from 'components/ButtonCTA'
import AuctionAmountSummary from 'containers/AuctionAmountSummary'

export interface WalletPanelProps {
  auctionAddress: string,
  submitOrder(): any,
}


const WalletPanel: React.SFC<WalletPanelProps> = ({ auctionAddress, submitOrder }) => (
  <AuctionContainer auctionDataScreen="details">
    <AuctionHeader backTo="/order">
      Confirm Order Details
      </AuctionHeader>
    <AuctionAmountSummary />
    <AuctionPriceBar header="Price" />
    <AuctionWalletSummary />
    <p>
      When submitting the order and signing with MetaMask,
        your deposit will be added to the next (scheduled) auction. Every auction takes approx. 5 hours.
      </p>
    <ButtonCTA onClick={submitOrder} to={`/auction/${auctionAddress}`}>
      Submit Order <i className="icon icon-walletOK"></i>
    </ButtonCTA>
  </AuctionContainer>
)

export default WalletPanel
