import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionFooter from 'components/AuctionFooter'
import AuctionHeader from 'components/AuctionHeader'
import AuctionProgress from 'components/AuctionProgress'
import AuctionStatus from 'components/AuctionStatus'

import Loader from 'components/Loader'
import Aux from 'components/AuxComponent'

import { AuctionStateState, AuctionStateProps } from 'components/AuctionStateHOC'

import { AuctionStatus as Status } from 'globals'

type AuctionPanelProps = AuctionStateState & AuctionStateProps

const status2progress = {
  [Status.INIT]: 1,
  [Status.PLANNED]: 2,
  [Status.ACTIVE]: 3,
  [Status.ENDED]: 4,
}

const getAuctionProgress = (status: Status) => status2progress[status] || 0

const AuctionPanel: React.SFC<AuctionPanelProps> = ({
  match: { url },
  sell, buy,
  status, completed, timeToCompletion,
  userSelling, userGetting, userCanClaim,
}) => (
  <AuctionContainer auctionDataScreen="status">
    <AuctionHeader backTo="/wallet">
      {/* TODO: grab auction address for url */}
      Auction URL: <a href="#">https://www.dutchx.pm{url}/</a>
    </AuctionHeader>
    <Loader
      data={sell}
      render={() =>
        <Aux>
          <AuctionStatus
            sellToken={sell}
            buyToken={buy}
            buyAmount={userCanClaim}
            timeLeft={timeToCompletion}
            status={status}
          />
          <AuctionProgress progress={getAuctionProgress(status)} />
          <AuctionFooter
            sellTokenSymbol={sell.symbol || sell.name || sell.address}
            buyTokenSymbol={buy.symbol || buy.name || buy.address}
            sellAmount={userSelling}
            buyAmount={userGetting}
            sellDecimal={sell.decimals}
            buyDecimal={buy.decimals}
            auctionEnded={completed}
          />
        </ Aux>
      } />
  </AuctionContainer>
)

export default AuctionPanel
