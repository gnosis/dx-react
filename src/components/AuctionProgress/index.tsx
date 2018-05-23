import React from 'react'

import arrowDownStep from 'assets/arrowDownStep.svg'
import auctionStep from 'assets/auctionStep.svg'
import walletStep from 'assets/walletStep.svg'

/**
 * progress can be [0,4]
 * 0 - no steps completed
 * 1 - step one active
 * 2 - step one completed, step two active
 * 3 - steps one and two completed, step three active
 * 4 - all steps completed
 */
interface AuctionProgressProps {
  progress: number
}

const AuctionProgress: React.SFC<AuctionProgressProps> = ({ progress }) => (
  <div className="auctionProgress">
    <div className="progress-bar" data-progress={progress}></div>
    <span>
      <i className={progress >= 1 ? 'active' : null} data-icon={progress > 1 ? 'ok' : null}>
        <img src={arrowDownStep} />
        <small>DEPOSIT CONFIRMED</small>
      </i>
      <i className={progress >= 2 ? 'active' : null} data-icon={progress > 2 ? 'ok' : null}>
        <img src={auctionStep} />
        <small>AUCTION STARTED</small>
      </i>
      <i className={progress >= 3 ? 'active' : null} data-icon={progress > 3 ? 'ok' : null}>
        <img src={walletStep} />
        <small>CLAIM TOKENS TO YOUR WALLET</small>
      </i>
    </span>
  </div>
)

export default AuctionProgress
