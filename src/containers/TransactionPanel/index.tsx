import React from 'react'
import { connect } from 'react-redux'

import { State } from '../../types'

interface TransactionPanelProps {
  transactionsPending: any[];
}

const txPanelCSS: React.CSSProperties = {
  display: 'flex',
  flexFlow: 'column',
  width: '100%',

  background: 'white',
  color: 'black',
}

const TransactionPanel = ({ transactionsPending }: TransactionPanelProps) => {
  return (
        <div style={txPanelCSS}>
            <ol>
                {transactionsPending.map(({ txName, txHash }: any) => <li key={txHash}>{`${txName}: ${txHash}`}</li>)}
            </ol>
        </div>
    )
}

const mapState = (state: State) => ({
  transactionsPending: state.LOGS_AND_EVENTS.transactionsPending,
})

export default connect(mapState)(TransactionPanel)
