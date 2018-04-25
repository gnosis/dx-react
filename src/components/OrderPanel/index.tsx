import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionSellingGetting from 'containers/AuctionSellingGetting'
import ButtonCTA from 'components/ButtonCTA'
import TokenPair from 'containers/TokenPair'
import TokenOverlay from 'containers/TokenOverlay'

import { Balance } from 'types'

interface OrderPanelProps {
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  sellAmount: Balance
}

const OrderPanel: React.SFC<OrderPanelProps> = ({ sellTokenSymbol, buyTokenSymbol, sellAmount }) => (
  <AuctionContainer auctionDataScreen="amount">
    <TokenOverlay />
    <AuctionHeader backTo="/">
      Token Auction {sellTokenSymbol}/{buyTokenSymbol}
    </AuctionHeader>

    {/* Display 'pair-noMGN' when this pair won't generate MGN tokens (any of the picked token causing this) */}
    <div className="pair-noMGN">Note: this token pair won't generate MGN tokens</div>
    {/* END */}

    <TokenPair />
    <AuctionPriceBar header="Closing Price" />
    <AuctionSellingGetting />
    {/* TODO: replace onclick with some logic (maybe: "to" prop) */}
    <ButtonCTA
      className={+sellAmount > 0 ? 'blue' : 'buttonCTA-disabled'}
      onClick={e => +sellAmount > 0 ? console.log('Continuing to wallet') : e.preventDefault()}
      to={'./wallet'}>
      {+sellAmount > 0 ? 'Continue to wallet details' : 'Please select a sell amount'}
    </ButtonCTA>
  </AuctionContainer>
)

export default OrderPanel
