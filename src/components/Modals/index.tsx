import React from 'react'

export interface TransactionModalProps {
  header?: string,
  body?: string,
  activeProvider?: string,
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
  fontSize: '2.2vw', 
  margin: '20px',
}

export const TransactionModal: React.SFC<TransactionModalProps> = ({ 
  header, 
  body, 
  activeProvider, 
}) =>
  <div style={tempDivStyle as any}>
    <h1 style={tempH1Style as any}>{header || 'Approving Tokens && Transferring'}</h1>
    <p style={tempPStyle}>
      { body || `Please check your ${activeProvider || 'Provider'} notifications in the upper bar of your browser.` }
    </p>
  </div>
