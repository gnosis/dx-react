import React from 'react'

import AuctionContainer from 'components/AuctionContainer'
import AuctionFooter from 'components/AuctionFooter'
import AuctionHeader from 'components/AuctionHeader'
import AuctionProgress from 'components/AuctionProgress'
import AuctionStatus from 'components/AuctionStatus'

import Loader from 'components/Loader'

import { AuctionStatus as Status } from 'globals'

import { AuctionStateState, AuctionStateProps } from 'components/AuctionStateHOC'

type AuctionPanelProps = AuctionStateState & AuctionStateProps & {
  claimSellerFunds: () => any,
}

// const status2progress = {
//   [Status.INIT]: 1,
//   [Status.PLANNED]: 2,
//   [Status.ACTIVE]: 3,
//   [Status.ENDED]: 4,
// }

// const getAuctionProgress = (status: Status) => status2progress[status] || 0

const AuctionPanel: React.SFC<AuctionPanelProps> = ({
  match: { url },
  sell, buy,
  status, completed, timeToCompletion,
  userSelling, userGetting, userCanClaim,
  progress,
  error,
  claimSellerFunds,
  theoreticallyCompleted,
}) => (
  <AuctionContainer auctionDataScreen="status">
    <AuctionHeader backTo="/wallet">
      Auction URL: <a href={typeof window !== 'undefined' && window.location.hash || ''}>
        {typeof window !== 'undefined' ? window.location.hash : `https://www.dutchx.pm${url}/`}
      </a>
    </AuctionHeader>
    <Loader
      hasData={sell}
      message={error || 'Looking for selected auction ...'}
      render={() =>
        <>
          <AuctionStatus
            sellToken={sell}
            buyToken={buy}
            sellAmount={userSelling}
            buyAmount={userCanClaim}
            timeLeft={timeToCompletion}
            status={status}
            completed={completed}
            theoreticallyCompleted={theoreticallyCompleted}
            claimSellerFunds={claimSellerFunds}
          />
          <AuctionProgress
            progress={progress}
            marks={[
              userSelling.gt(0),
              userSelling.gt(0) && (status === Status.ACTIVE || status === Status.ENDED),
              false,
            ]}
          />
          <AuctionFooter
            sellTokenSymbol={sell.symbol || sell.name || sell.address}
            buyTokenSymbol={buy.symbol || buy.name || buy.address}
            sellAmount={userSelling}
            buyAmount={userGetting}
            sellDecimal={sell.decimals}
            buyDecimal={buy.decimals}
            auctionEnded={completed}
            status={status}
          />
        </>
      } />
  </AuctionContainer>
)

export default AuctionPanel
