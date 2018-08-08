import React from 'react'
import { connect } from 'react-redux'

import { State } from '../../types'

interface TransactionPanelProps {
  transactionsPending: any[];
}

class TransactionPanel extends React.Component<TransactionPanelProps> {
  state = {
    open: false,
  }

  handleClick = () => this.setState({ open: !this.state.open })

  render() {
    const { transactionsPending }: TransactionPanelProps = this.props
    return (
      <div onClick={this.handleClick} className={`txPanel${!this.state.open ? ' closed' : ''}`}>
          {this.state.open
          ?
            transactionsPending.length
            ?
              <ol>{transactionsPending.map(({ txName, txHash }: any) => <li key={txHash}>{`${txName}: ${txHash}`}</li>)}</ol>
            : <div>No pending transactions</div>
          :
            <div>Transactions</div>
          }
      </div>
    )
  }
}

const mapState = (state: State) => ({
  transactionsPending: state.LOGS_AND_EVENTS.transactionsPending,
})

export default connect(mapState)(TransactionPanel)
