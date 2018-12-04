import React from 'react'
import { COMPANY_NAME, URLS } from 'globals'
import DXContractPicker from 'components/DXContractSwitcher'

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
        <a className="buttonCTA" href={URLS.GNOSIS_SAFE_SITE} target="_blank" rel="noopener noreferrer">
          Download Gnosis Safe <i className="icon icon-arrowDown"></i>
        </a>
      }
    </div >
  )
}

export const ClaimOnly: React.SFC<any> = () =>
    <div className="noWallet">

        <h2><strong><span className="underline">ATTENTION</span>: CLAIM ONLY MODE</strong></h2>
        <DXContractPicker />
        <p>
          <strong>This is a deprecated version of {COMPANY_NAME}.</strong>
          <br/><br/>
          Trading is no longer available on this contract version. You may only <span className="underline">withdraw</span> your funds.
          <br/><br/>
          For trading, please head to the latest, up-to-date version available below:
        </p>

        <a className="buttonCTA" href={`https://${URLS.APP_URL_MAIN}`} rel="noopener noreferrer">
          Trade on {COMPANY_NAME} <i className="icon icon-arrowDown"></i>
        </a>
    </div >

export default NoWallet
