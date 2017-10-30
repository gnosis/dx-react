import React from 'react'

import TokenOverlay from 'containers/TokenOverlay'
import TokenPair from 'containers/TokenPair'
import ButtonCTA from '../ButtonCTA'
import TopAuctions from 'containers/TopAuctions'

interface TokenPickerProps {
  continueToOrder(): any,
}

const TokenPicker: React.SFC<TokenPickerProps> = ({ continueToOrder }) => (
  <div className="tokenPicker">
    <TokenOverlay />
    <div className="tokenIntro">
      <h2>Pick Token Pair Auction</h2>
      <TokenPair />
      <ButtonCTA onClick={continueToOrder}>Continue to order details</ButtonCTA>
    </div>
    <TopAuctions />
  </div>
)

export default TokenPicker
