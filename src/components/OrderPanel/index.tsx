import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionSellingGetting from 'containers/AuctionSellingGetting'
import ButtonCTA from 'components/ButtonCTA'
import TokenPair from 'containers/TokenPair'

import { TokenPair as TokenPairType } from 'types'

interface OrderPanelProps {
  tokenPair: TokenPairType,
}

const OrderPanel: React.SFC<OrderPanelProps> = ({
  tokenPair: { sell, buy },
}) => (
    <AuctionContainer auctionDataScreen="amount">
      <AuctionHeader backTo="/">
        Token Auction ${sell}/${buy}
      </AuctionHeader>
      <TokenPair />
      <AuctionPriceBar header="Closing Price" />
      <AuctionSellingGetting />
      {/* TODO: replace onclick with some logic (maybe: "to" prop) */}
      <ButtonCTA onClick={() => console.log('Continuing to wallet')}>
        Continue to wallet details
      </ButtonCTA>
    </AuctionContainer>
  )

export default OrderPanel
