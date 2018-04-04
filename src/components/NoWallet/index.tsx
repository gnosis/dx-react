import React from 'react'

import ButtonCTA from 'components/ButtonCTA'

interface NoWalletProps {
  handleClick?(): void
  hide?: boolean
}

export const NoWallet: React.SFC<NoWalletProps> = ({
  handleClick,
  hide = false,
}) => (
    <div className={`noWallet${hide ? ' hide' : ''}`}>

      {/*
        Two states:
        #1 - User has a wallet client (detected) but isn't unlocked
        #2 - No wallet client detected > Ask to download MetaMask (later we change to download Gnosis Safe)
      */}

      {/* If state #1 */}
      <h2><strong>Unlock your wallet client</strong> <br/>before continuing.</h2>
      {/* END */}

      {/* If state #2 */}
      <h2><strong>No wallet client detected.</strong> <br/>Enable or install your wallet.</h2>
      {/* END */}

      <span className="icon-walletUnlock"></span>

      {/* If state #2 */}
      <ButtonCTA onClick={handleClick} className={null} to="https://metamask.io/" target="_blank">
        Download MetaMask <i className="icon icon-arrowDown"></i>
      </ButtonCTA >
      {/* END */}

    </div >
  )

export default NoWallet
