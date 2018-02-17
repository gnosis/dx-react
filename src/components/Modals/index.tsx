import React from 'react'

export interface TransactionModalProps {
  modalProps: any,
  activeProvider?: string,
  closeModal?: any,
}

const tempDivStyle = {
  position: 'fixed', 
  display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center',

  color: 'white',
  
  height: '100vh', width: '100vw',
  textAlign: 'center',
}

const tempH1Style = {
  color: 'white',
  fontSize: '4vw', 
  margin: '20px',
}

const tempPStyle = {
  fontSize: '2.2vw', lineHeight: 1.3,
  margin: '20px',
}

export const TransactionModal: React.SFC<TransactionModalProps> = ({ 
  modalProps: {
    header, 
    body,
    button,
  }, 
  activeProvider,
  closeModal,
}) => {
  console.log(closeModal)
  return ( 
  <div style={tempDivStyle as any}>
    <h1 style={tempH1Style as any}>{header || 'Approving Tokens and Transferring'}</h1>
    <p style={tempPStyle}>
      { body || `Please check your ${activeProvider || 'Provider'} notifications in extensions bar of your browser.` }
    </p>
    {button && 
      <button
        onClick={() => closeModal()}
      >
        CLOSE
      </button>
    }
  </div>
  )
}
