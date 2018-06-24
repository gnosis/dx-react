import React from 'react'

// TODO: get types from global types/
export interface AuctionWalletSummaryProps {
  address: string,
  provider: string,
  network: string,
  connected?: boolean
}

const AuctionWalletSummary: React.SFC<AuctionWalletSummaryProps> = ({ address, provider, network, connected }) => (
  <div className="auctionWalletSummmary">
    <span>
      <big>Connected Wallet</big>
      <i data-icon={connected ? 'ok' : null}>{provider}</i>
      <small>[{network}]</small>
    </span>

    <span>
      <big>YOUR WALLET ADDRESS</big>
      <code>{address}</code>
    </span>
  </div>
)

export default AuctionWalletSummary
