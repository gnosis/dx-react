/* eslint no-console:0 */
import React from 'react'
import { getAllAccounts } from 'api/dutchx'
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
    <button onClick={() => getBalance('DutchExchange', provider)}>Click me for your balance!</button>
    <h3>Current Balance = {balance ? `${balance.e} Ether` : 'Unavailable'}</h3>
    <br />
    <br />
    <button onClick={() => getAllAccounts() }>Click me for ALL ACCOUNTS</button>
  </div>
)

export default BalanceButton
