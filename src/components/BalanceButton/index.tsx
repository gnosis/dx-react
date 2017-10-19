/* eslint no-console:0 */
import React from 'react'

// const Web3 = require('web3')

interface Currency {
  [Currency: string]: number
}

interface BalanceButtonProps {
  balance: Currency,
  getBalance: Function,
  provider: String,
}

const BalanceButton = ({ balance, getBalance, provider }: BalanceButtonProps) => (
  <div>
    <br />
    <button onClick={() => getBalance('Balance', provider)}>Click me for your balance!</button>
    <br />
    <br />
    <h3>Current Balance = {balance ? `${balance.e} Ether` : 'Unavailable'}</h3>
  </div>
)

export default BalanceButton
