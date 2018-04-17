import React from 'react'

import TokenOverlay from 'containers/TokenOverlay'
import TokenPair from 'containers/TokenPair'
import TokenUpload from 'containers/TokenUpload'
import ButtonCTA from '../ButtonCTA'
import TopAuctions from 'containers/TopAuctions'

import { HOCState } from 'components/IPFSHOC'

interface TokenPickerProps {
  continueToOrder(): any;
  setTokenListType({}): void;
  to: string;
}

const TokenPicker: React.SFC<TokenPickerProps & Partial<HOCState>> = ({ continueToOrder, needsTokens, to, setTokenListType }) => (

  <div className="tokenPicker">
    <TokenOverlay />

    {needsTokens
      ?
      <TokenUpload />
      :
      <div className="tokenIntro">
        <h2>Pick Token Pair Auction</h2>
        <TokenPair />
        <ButtonCTA onClick={continueToOrder} to={to}>Specify amount selling</ButtonCTA>
        <a className="showTokenUpload" onClick={() => setTokenListType({ type: 'UPLOAD' })}>Upload Additional Token List</a>
      </div>
    }

    <TopAuctions />
  </div>
)

export default TokenPicker
