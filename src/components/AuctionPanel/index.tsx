import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionFooter from 'containers/AuctionFooter'
import AuctionHeader from 'components/AuctionHeader'
import AuctionProgress from 'containers/AuctionProgress'
import AuctionStatus from 'components/AuctionStatus'

import BuyButton from 'components/BuyButton'

import { AuctionStateState, AuctionStateProps } from 'components/AuctionStateHOC'

type AuctionPanelProps = AuctionStateState & AuctionStateProps

const AuctionPanel: React.SFC<AuctionPanelProps> = ({
  match: { url },
  // @ts-ignore
  sell, buy, price,
  // @ts-ignore
  status, completed, timeToCompletion,
  // @ts-ignore
  userSelling, userGetting, userCanClaim, 
}) => (
  <AuctionContainer auctionDataScreen="status">
    <AuctionHeader backTo="/wallet">
      {/* TODO: grab auction address for url */}
      Auction URL: <a href="#">https://www.dutchx.pm/{url}/</a>
    </AuctionHeader>
    <AuctionStatus
      sellToken={sell}
      buyToken={buy}
      buyAmount={userCanClaim}
      timeLeft={timeToCompletion}
      status={status}
    />
    <BuyButton />
    <AuctionProgress />
    <AuctionFooter />
  </AuctionContainer>
)

export default AuctionPanel
