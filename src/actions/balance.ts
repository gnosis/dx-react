/* eslint no-console: 0 */
// import thunk from 'redux-thunk'
import { createAction } from 'redux-actions'
import { getCurrentBalance } from '../api'

export const getBalanceBase: Function = createAction('GET_CONTRACT_BALANCE')

export const getBalance = (address: string) => async (dispatch: Function) => {
  // console.log(contract)

  try {
    const reqBalance = (await getCurrentBalance('ETH', address)).toString()
    console.log(`Success! Balance for ${address} = `, reqBalance)
    dispatch(getBalanceBase({ success: true, reqBalance }))
  } catch (err) {
    console.log(err)
    dispatch(getBalanceBase({ success: false, err }))
  }
}

export const getEthBalance = () => (window.alert(window.web3.eth.getBalance()))
