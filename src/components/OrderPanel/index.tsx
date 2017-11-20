import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionSellingGetting from 'containers/AuctionSellingGetting'
import ButtonCTA from 'components/ButtonCTA'
import TokenPair from 'containers/TokenPair'
import TokenOverlay from 'containers/TokenOverlay'

import { TokenCode } from 'types'

interface OrderPanelProps {
  sellToken: TokenCode,
  buyToken: TokenCode,
}

const OrderPanel: React.SFC<OrderPanelProps> = ({ sellToken, buyToken }) => (
  <AuctionContainer auctionDataScreen="amount">
    <TokenOverlay />
    <AuctionHeader backTo="/">
      Token Auction {sellToken}/{buyToken}
    </AuctionHeader>
    <TokenPair />
    <AuctionPriceBar header="Closing Price" />
    <AuctionSellingGetting />
    {/* TODO: replace onclick with some logic (maybe: "to" prop) */}
    <ButtonCTA onClick={() => console.log('Continuing to wallet')} to="/wallet">
      Continue to wallet details
      </ButtonCTA>
  </AuctionContainer>
)

export default OrderPanel
