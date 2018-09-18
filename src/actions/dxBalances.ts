import { createAction, handleActions } from 'redux-actions'

import { Account, BigNumber, State, TokenBalances } from 'types'
import { getDXTokenBalance, fillDefaultAccount } from 'api'
import { Dispatch } from 'redux'
import { batchActions } from 'redux-batched-actions'
import { DefaultTokenObject } from 'api/types'

// Actions for grabbing Balances out of App

export const getAllDXTokenBalances = async (tokenList: DefaultTokenObject[], account: Account) => {
  account = await fillDefaultAccount(account)

  const dxTokenBalances = await Promise.all(tokenList.map(({ address }) => getDXTokenBalance(address, account)))

  console.log(dxTokenBalances)
  return dxTokenBalances
}

export const getAllDXTokenInfo = async (tokenList: DefaultTokenObject[], account: Account) => {
  const dxTokenBalances = await getAllDXTokenBalances(tokenList, account)

  return tokenList.map((token, i) => ({
    ...token,
    balance: dxTokenBalances[i],
  }))
}

interface GetDXBalances {
  address?: Account;
  balance?: BigNumber;
}

export const setDxBalances = createAction<GetDXBalances>('SET_DX_BALANCES')

export const setAllDxBalances = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { blockchain: { currentAccount }, tokenList: { combinedTokenList } } = getState()

  const dxTokenBalances = await getAllDXTokenBalances(combinedTokenList, currentAccount)

  return dispatch(batchActions(
    dxTokenBalances.map((balance, i) => setDxBalances({ address: combinedTokenList[i].address, balance })),
  ))
}

const initialState = {}

export default handleActions<TokenBalances, GetDXBalances>(
  {
    [setDxBalances.toString()]: (state, action) => ({
      ...state,
      [action.payload.address]: action.payload.balance,
    }),
  },
  initialState,
)
