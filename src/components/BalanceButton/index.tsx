/* eslint no-console:0 */
import React from 'react'
import { tokenPairSelect } from 'api/dutchx'
// const Web3 = require('web3')

interface Currency {
  [Currency: string]: number
}

interface BalanceButtonProps {
  balance: Currency,
  getBalance: Function,
  provider: String,
}

let ether = 0xd76b5c2a23ef78368d8e34288b5b65d616b746ae
let gno = 0x6810e776880c02933d47db1b9fc05908e5386b96

const BalanceButton = ({ balance, getBalance, provider }: BalanceButtonProps) => (
  <div>
    <br />
    <button onClick={() => getBalance('DutchExchange', provider)}>Click me for your balance!</button>
    <br />
    <button onClick={() => tokenPairSelect('DutchExchangeFactory', ether, gno, 1, 1) }>Click me for TOKEN PAIRING!</button>
    <br />
    <h3>Current Balance = {balance ? `${balance.e} Ether` : 'Unavailable'}</h3>
  </div>
)

export default BalanceButton
