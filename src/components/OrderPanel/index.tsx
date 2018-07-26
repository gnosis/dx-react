import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionHeader from 'components/AuctionHeader'
import AuctionPriceBar from 'containers/AuctionPriceBar'
import AuctionSellingGetting from 'containers/AuctionSellingGetting'
import ButtonCTA from 'components/ButtonCTA'
import TokenPair from 'containers/TokenPair'
import TokenOverlay from 'containers/TokenOverlay'
import { URLS } from 'globals'

interface OrderPanelProps {
  sellTokenSymbol: string,
  buyTokenSymbol: string,
  validSellAmount: boolean,
  generatesMGN: boolean,
  overlayOpen: boolean,

  pushAndMoveToElement: (id: string, url?: string) => void
}

const OrderPanel: React.SFC<OrderPanelProps> = ({ sellTokenSymbol, buyTokenSymbol, validSellAmount, generatesMGN, overlayOpen, pushAndMoveToElement }) => (
  <AuctionContainer auctionDataScreen="amount">
    {overlayOpen && <TokenOverlay />}
    <AuctionHeader backTo="/">
      Token Pair {sellTokenSymbol || '?'} / {buyTokenSymbol || '?'}
    </AuctionHeader>

    {/* Display 'pair-noMGN' when this pair won't generate MGN tokens (any of the picked token causing this) */}
    {sellTokenSymbol && buyTokenSymbol && !generatesMGN && <div className="pair-noMGN">Note: this token pair <span className="sectionLink" onClick={() => pushAndMoveToElement('what-is-mgn', URLS.TOKENS)}>won't generate MGN tokens</span></div>}
    {/* END */}

    <TokenPair />
    <AuctionPriceBar header="Closing Price" />
    <AuctionSellingGetting />
    {/* TODO: replace onclick with some logic (maybe: "to" prop) */}
    <ButtonCTA
      className={validSellAmount ? 'blue' : 'buttonCTA-disabled'}
      onClick={e => validSellAmount ? console.log('Continuing to wallet') : e.preventDefault()}
      to={'./wallet'}>
      {validSellAmount ? 'Continue to wallet details' : 'Please select amount to deposit'}
    </ButtonCTA>
  </AuctionContainer>
)

export default OrderPanel
