/* eslint no-console:0 */
import React from 'react'
import PropTypes from 'prop-types'

const BalanceButton = ({ balance, dispatchGetBalance, dutchXInst, provider }) => (
  <div>
    <br />
    <button onClick={() => dispatchGetBalance('Balance', provider)}>Click me for your balance!</button>
    <br />
    <br />
    <h3>Current Balance = {balance ? balance.toString() : 'Unavailable'}</h3>
  </div>
)

BalanceButton.propTypes = {
  balance: PropTypes.object,
  dispatchGetBalance: PropTypes.func,
  provider: PropTypes.string,
}

export default BalanceButton
