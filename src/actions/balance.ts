/* eslint no-console: 0 */
// import thunk from 'redux-thunk'
import { createAction } from 'redux-actions'
import { getDutchXConnection } from '../api/dutchx'

export const getBalanceBase: Function = createAction('GET_CONTRACT_BALANCE')

export const getBalance = (contract: string, address: string) => async (dispatch: Function) => {
  // console.log(contract)
  let inst
  let dutchX

  try {
    dutchX = await getDutchXConnection()
    inst = await dutchX[contract]
    const reqBalance = await inst.getBalance.call(address)
    console.log(`Success! Balance for ${address} = `, reqBalance)
    dispatch(getBalanceBase({ success: true, reqBalance }))
  } catch (err) {
    console.log(err)
    dispatch(getBalanceBase({ success: false, err }))
  }
}

export const getEthBalance = () => (window.alert(window.web3.eth.getBalance()))
