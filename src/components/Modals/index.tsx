import React, { CSSProperties } from 'react'
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

const tempParentDiv: CSSProperties = {
  display: 'flex',
  flexFlow: 'column nowrap',
  alignItems: 'center', justifyContent: 'center',
  width: '100%',
}

const tempButtonDiv: CSSProperties = {
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'center', alignItems: 'center',
  padding: 10,
  width: '75%',
}

const tempDivStyle: CSSProperties = {
  position: 'fixed', 
  display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center',

  color: 'white',
  
  height: '100vh', width: '100vw',
  textAlign: 'center',
}

export const TransactionModal: React.SFC<TransactionModalProps> = ({ 
  modalProps: {
    header, 
    body,
    button,
    error,
  }, 
  activeProvider,
  closeModal,
}) =>
  <div style={tempDivStyle}>
    <h1 className="modalH1">{header || 'Approving Tokens and Transferring'}</h1>
    <p className="modalP">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
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
  <div style={tempDivStyle}>
    <h1 className="modalH1">{header || 'Please choose Token Approval amount'}</h1>
    <p className="modalP">
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    <div style={tempParentDiv}>
      <div style={tempButtonDiv}>
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
      <div style={tempButtonDiv}>  
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
}

export const BlockModal: React.SFC<BlockModalProps> = ({ 
  disabledReason, 
}) =>
  <div style={tempDivStyle}>
    <h1 className="modalH1">{disabledReasons[disabledReason]}</h1>
  </div>
