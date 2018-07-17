import React from 'react'

interface NoWalletProps {
  handleClick?(): void,
  walletUnavailable: boolean,
  walletLocked: boolean,
}

export const NoWallet: React.SFC<NoWalletProps> = ({
  walletUnavailable, walletLocked,
}) => {
  const showUnlock = !walletUnavailable && walletLocked
  return (
    <div className="noWallet">

      {showUnlock &&
        <h2><strong>Unlock your wallet client</strong> <br/>before continuing.</h2>
      }

      {walletUnavailable &&
        <h2><strong>No wallet client detected.</strong> <br/>Enable or install your wallet.</h2>
      }

      {showUnlock && <span className="icon-walletUnlock"></span>}

      {walletUnavailable &&
        <a className="buttonCTA" href="https://metamask.io/" target="_blank">
          Download MetaMask <i className="icon icon-arrowDown"></i>
        </a>
      }
    </div >
  )
}

export default NoWallet
