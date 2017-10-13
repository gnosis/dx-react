/* eslint no-console: 0 */
import ReduxThunk from 'redux-thunk'
import { createAction } from 'redux-actions'
import { getDutchXConnection } from 'contract-fe-test/api/dutchx'

export const getBalanceBase = createAction('GET_CONTRACT_BALANCE')

export const getBalance = (contract, address = tx.origin) => async (dispatch) => {
  console.log(contract)
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
