/* eslint no-console:0 */
import React from 'react'
import PropTypes from 'prop-types'

import Web3 from 'web3'

const BalanceButton = ({ balance, dispatchGetBalance, provider }) => (
  <div>
    <br />
    <button onClick={() => dispatchGetBalance('Balance', provider)}>Click me for your balance!</button>
    <br />
    <br />
    <h3>Current Balance = {balance ? Web3.fromWei(balance) : 'Unavailable'}</h3>
  </div>
)

BalanceButton.propTypes = {
  balance: PropTypes.object,
  dispatchGetBalance: PropTypes.func,
  provider: PropTypes.string,
}

export default BalanceButton
