/* eslint no-console: 0 */
import ReduxThunk from 'redux-thunk'
import { createAction } from 'redux-actions'

import Web3 from 'web3'

import contract from 'truffle-contract'
import data from '../../../build/contracts/Balance.json'

const Balance = contract(data)
Balance.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))

export const getBalanceBase = createAction('GET_CONTRACT_BALANCE')

export const getBalance = (address = tx.origin) => async (dispatch) => {
  Balance.deployed().then((res) => { console.log('CONTRACT DEPLOYMENT RESPONSE = ', res) })
  let bal
  try {
    const inst = await Balance.deployed()
    bal = inst
    // return bal.getBalance(address)
    const reqBalance = await bal.getBalance.call(address)
    console.log(`Success! Balance for ${address} = `, reqBalance)
    dispatch(getBalanceBase({ success: true, reqBalance }))
  } catch (err) {
    console.log(err)
    dispatch(getBalanceBase({ success: false, err }))
  }
}
