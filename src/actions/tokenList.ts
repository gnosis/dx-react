import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'

import { setTokenBalance } from 'actions'
import { getTokenBalances } from 'api'

import { TokenListType, State } from 'types'
import { DefaultTokenObject } from 'api/types'

export const setDefaultTokenList = createAction<{ defaultTokenList: DefaultTokenObject[] }>('SET_DEFAULT_TOKEN_LIST')
export const setCustomTokenList = createAction<{ customTokenList: DefaultTokenObject[] | any[] }>('SET_CUSTOM_TOKEN_LIST')

export const setTokenListType = createAction<{ type: TokenListType['CUSTOM' | 'DEFAULT' | 'UPLOAD'] }>('SET_TOKEN_LIST_TYPE')

export const setTokenListVersion = createAction<{ version: number | string }>('SET_TOKEN_LIST_VERSION')

export const setNewIPFSCustomListAndUpdateBalances = (p1: { customTokenList: DefaultTokenObject[] }) => async (dispatch: Function, getState: () => State) => {
  dispatch(setCustomTokenList(p1))

  // grab updated customTokenList from State
  const { tokenList: { customTokenList } } = getState()

  // set list type to Custom
  dispatch(setTokenListType({ type: 'CUSTOM' }))

  // recalculate Token Balances
  const tokenBalances = await getTokenBalances(customTokenList)

  dispatch(batchActions(
    tokenBalances.map(tok => setTokenBalance({ address: tok.address, balance: tok.balance })),
    'SET_ALL_TOKEN_BALANCES',
  ))
}
