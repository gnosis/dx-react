import React from 'react'

import TokenOverlay from 'containers/TokenOverlay'
import TokenPair from 'containers/TokenPair'
import TokenUpload from 'components/TokenUpload'
import ButtonCTA from '../ButtonCTA'
import TopAuctions from 'containers/TopAuctions'

interface TokenPickerProps {
  continueToOrder(): any,
  to: string,
}

const TokenPicker: React.SFC<TokenPickerProps> = ({ continueToOrder, to }) => (

  <div className="tokenPicker">
    <TokenOverlay />

    {/* Only show TokenUpload IF no tokens are uploaded OR if triggered by user to upload more tokens. */}
    <TokenUpload />

    {/*  Only show tokenIntro div IF Tokens are uploaded */}
    <div className="tokenIntro">
      <h2>Pick Token Pair Auction</h2>
      <TokenPair />

      {/*
        * TODO: Remove? Not necessary and in TokenUpload
        * Only show IF Tokenlist is NOT uploaded
        */}
      <ButtonCTA onClick={continueToOrder} to={to}>Upload Tokenlist</ButtonCTA>

      {/*  Only show IF Tokenlist IS uploaded */}
      <ButtonCTA onClick={continueToOrder} to={to}>Specify amount selling</ButtonCTA>

      {/*  Only show IF Tokenlist IS uploaded | Shows the TokenUpload overlay */}
      <a href="#" className="showTokenUpload">Upload Additional Token List</a>
    </div>

    <TopAuctions />
  </div>
)

export default TokenPicker
