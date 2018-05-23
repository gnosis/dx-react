import React from 'react'
import { Modal } from 'types'
import { closeModal, approveAndPostSellOrder } from 'actions'

interface TransactionModalProps {
  activeProvider?: string,
  closeModal?: typeof closeModal,
  modalProps: Modal['modalProps'],
  error?: string,
}

interface ApprovalModalProps extends TransactionModalProps {
  approvalButton: any,
  approveAndPostSellOrder: typeof approveAndPostSellOrder,
}

interface BlockModalProps extends TransactionModalProps {
  disabledReason: string,
}

export const TransactionModal: React.SFC<TransactionModalProps> = ({
  modalProps: {
    header,
    body,
    txData,
    button,
    error,
  },
  activeProvider,
  closeModal,
}) =>
  <div className="modalDivStyle">
    <h1>{header || 'Approving Tokens and Transferring'}</h1>
    <p className="modalHeaderDescriptor">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    {txData && <div className="modalTXDataDiv">
      <ul>
        <li>{`Sell Amount:    ${txData.sellAmount}`}</li>
        {(txData.tokenA.symbol || txData.tokenA.name) &&
        <li>{`Token Selling:  ${txData.tokenA.symbol || txData.tokenA.name}${txData.tokenA.name && txData.tokenA.symbol && ' [' + txData.tokenA.name + ']'}`}</li>
        }
        <li>{`Sell Token Address:  ${txData.tokenA.address}`}</li>
        <br />
        {(txData.tokenB.symbol || txData.tokenB.name) &&
        <li>{`Token Receiving:  ${txData.tokenB.symbol || txData.tokenB.name}${txData.tokenB.name && txData.tokenB.symbol && ' [' + txData.tokenB.name + ']'}`}</li>
        }
        <li>{`Receiving Token Address:  ${txData.tokenB.address}`}</li>
        <li>Verify receiving token validity via EtherScan: <a target="_blank" href={`https://etherscan.io/token/${txData.tokenB.address}`}>{`https://etherscan.io/token/${txData.tokenB.address}`}</a></li>
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
  },
  activeProvider,
  approveAndPostSellOrder,
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
          onClick={() => approveAndPostSellOrder('MAX')}
          >
          Approve Max
        </button>
        <p className="modalButtonDescription">
          Choose this option to stop seeing this prompt and only sign 1 transaction per sell order
        </p>
      </div>
      <div className="modalButtonDiv">
        <button
          className="modalButton"
          onClick={() => approveAndPostSellOrder('MIN')}
          >
          Approve Min
        </button>
        <p className="modalButtonDescription">
          Choose this option to require signing 2 transactions for each sell order
        </p>
      </div>
    </div>
  </div>

const disabledReasons = {
  geoblock: 'The Dutch Exchange is not available in your country',
  networkblock: 'The Dutch Exchange is not available on the current network',
}

export const BlockModal: React.SFC<BlockModalProps> = ({
  disabledReason,
}) =>
  <div className="modalDivStyle">
    <h1 className="modalH1">{disabledReasons[disabledReason]}</h1>
  </div>
