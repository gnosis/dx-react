/* eslint no-console:0 */
import React from 'react'

// const Web3 = require('web3')

interface Currency {
  [Currency: string]: number
}

interface BalanceButtonProps {
  balance: Currency,
  dispatchGetBalance: Function,
  provider: String,
}

const BalanceButton = ({ balance, dispatchGetBalance, provider }: BalanceButtonProps) => (
  <div>
    <br />
    <button onClick={() => dispatchGetBalance('Balance', provider)}>Click me for your balance!</button>
    <br />
    <br />
    <h3>Current Balance = {balance ? `${balance.e} Ether` : 'Unavailable'}</h3>
  </div>
)

export default BalanceButton
