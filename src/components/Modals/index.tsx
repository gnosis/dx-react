import React, { CSSProperties } from 'react'
import { Modal } from 'types'
import { closeModal } from 'actions'
import { network2URL } from 'globals'

import Loader from 'components/Loader'
import { ETHEREUM_NETWORKS } from 'integrations/constants'

interface TransactionModalProps {
  activeProvider?: string,
  closeModal?: typeof closeModal,
  modalProps: Modal['modalProps'],
  error?: string,
}

interface ApprovalModalProps extends TransactionModalProps {
  approvalButton: any,
}

interface BlockModalProps extends TransactionModalProps {
  disabledReason: string,
  networkAllowed?: Partial<ETHEREUM_NETWORKS>,
}

export const TransactionModal: React.SFC<TransactionModalProps> = ({
  modalProps: {
    header,
    body,
    txData,
    button,
    error,
    loader,
  },
  activeProvider,
  closeModal,
}) =>
  <div className="modalDivStyle">
    {loader &&
      <Loader
        hasData={false}
        render={() => <div>Loading...</div>}
        SVGChoice="ETHLogo"
      />
    }
    <h1>{header || 'Approving Tokens and Transferring'}</h1>
    <p className="modalHeaderDescriptor">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    {txData && <div className="modalTXDataDiv">
      <ul>
        <li>{`Amount deposited:    ${txData.sellAmount}`}</li>
        {(txData.tokenA.symbol || txData.tokenA.name) &&
        <li>{`Token depositing:  ${txData.tokenA.symbol || txData.tokenA.name}${(txData.tokenA.name && txData.tokenA.symbol) && ' (' + txData.tokenA.name + ')'}`}</li>
        }
        <li>{`Deposit token address:  ${txData.tokenA.address}`}</li>
        <br />
        {(txData.tokenB.symbol || txData.tokenB.name) &&
        <li>{`Token receiving:  ${txData.tokenB.symbol || txData.tokenB.name}${(txData.tokenB.name && txData.tokenB.symbol) && ' (' + txData.tokenB.name + ')'}`}</li>
        }
        <li>{`Receiving token address:  ${txData.tokenB.address}`}</li>
        <li>Verify receiving token validity via EtherScan: <a target="_blank" href={`${network2URL[txData.network]}token/${txData.tokenB.address}`}>{`${network2URL[txData.network]}token/${txData.tokenB.address}`}</a></li>
      </ul>
    </div>}
    {error &&
    <p className="modalError">
      {`${error.slice(0, 300)}...`}
    </p>}
    {button &&
    <button
      className="modalButton"
      onClick={closeModal}
    >
      CLOSE
    </button>
    }
  </div>

export const ApprovalModal: React.SFC<ApprovalModalProps> = ({
  modalProps: {
    header,
    body,
    footer,
    onClick,
    buttons,
  },
  activeProvider,
}) =>
  <div className="modalDivStyle">
    <h1 className="modalH1">{header || 'Please choose Token Approval amount'}</h1>
    <p className="modalP">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    <div className="modalParentDiv">

      <div className="modalButtonDiv">
        <button
          className="modalButton"
          onClick={() => onClick('MIN')}
          >
          {buttons && buttons.button1.buttonTitle1 || 'Approve Min'}
        </button>
        {buttons && buttons.button1.buttonDesc1 && <p className="modalButtonDescription">
          {buttons && buttons.button1.buttonDesc1 || 'You\'ll allow the DutchX to take just the amount of the current operation. Note that you\'ll have to sign a transfer confirmation and an order confirmation for future trades.'}
        </p>}
      </div>

      <div className="modalButtonDiv">
        <button
          className="modalButton"
          onClick={() => onClick('MAX')}
          >
          {buttons && buttons.button2.buttonTitle2 || 'Approve Max'}
        </button>
        {buttons && buttons.button2.buttonDesc2 && <p className="modalButtonDescription">
          {buttons && buttons.button2.buttonDesc2 || 'You\'ll allow the DutchX to also take your bidding token for future trades. The DutchX won\'t take any tokens until also confirm your order. You will use the same amount of funds but save transaction cost on future trades.'}
        </p>}
      </div>
    </div>
    {footer &&
      <p className="modalFooter">
        <i>
          {footer.msg || null}
          <br/>
          <br/>
          For more information, read the <a href={footer.url || './content/FAQ/#approval'} target="_blank">{footer.urlMsg || ' linked'}</a> page.
        </i>
      </p>}
  </div>

const blockModalStyle: CSSProperties = { fontSize: 16, fontWeight: 100 }

const disabledReasons = {
  geoblock: {
    title: 'The DutchX is currently not available.',
    render: () =>
      <div style={blockModalStyle}>
        <p>Please try again later. No funds are lost due to downtime.</p>
        <p>Still experiencing issues? You may be accessing the DutchX from a restricted country or region.</p>
        <br />
        <br />
        <small><i>For more information, read the <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">Blog</a> to learn more about the DutchX.</i></small>
      </div>,
  },
  networkblock: {
    title: 'The DutchX is not available on your network.',
    render: (network = 'RINKEBY Test Network') =>
    <div style={blockModalStyle}>
      <p>{`Make sure you’re connected to the ${network}.`}</p>
      <br />
      <br />
      <small><i>For more information, read the <a href="https://blog.gnosis.pm/tagged/dutchx" target="_blank">Blog</a> to learn more about the DutchX.</i></small>
    </div>,
  },
}

export const BlockModal: React.SFC<BlockModalProps> = ({
  disabledReason,
  networkAllowed,
}) =>
  <div className="modalDivStyle">
    <h1 className="modalH1">{disabledReasons[disabledReason].title}</h1>
    {disabledReasons[disabledReason].render && disabledReasons[disabledReason].render(networkAllowed)}
  </div>
