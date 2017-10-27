import React from 'react'

import ButtonCTA from 'components/ButtonCTA'

interface NoWalletProps {
  handleClick?(): void
  hide?: boolean
}

export const NoWallet: React.SFC<NoWalletProps> = ({ 
  handleClick,
  hide = false, 
}): JSX.Element => (
  <div className={`noWallet${hide ? ' hide' : ''}`}>
    <h2>Enable &amp; unlock your <strong>Mist / Metamask wallet</strong> to connect before continuing.</h2>
    <span className="icon-walletUnlock"></span>
    <ButtonCTA onClick={handleClick}>
      Download MetaMask <i className="icon icon-Arrowdown"></i>
    </ButtonCTA>
  </div>
)

export default NoWallet
