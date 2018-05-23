import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'

import { setTokenBalance, setIPFSFileHashAndPath } from 'actions'
import { getTokenBalances } from 'api'

import { TokenListType, State } from 'types'
import { DefaultTokenObject } from 'api/types'

export const setDefaultTokenList = createAction<{ defaultTokenList: DefaultTokenObject[] }>('SET_DEFAULT_TOKEN_LIST')
export const setCustomTokenList = createAction<{ customTokenList: DefaultTokenObject[] | any[] }>('SET_CUSTOM_TOKEN_LIST')

export const setTokenListType = createAction<{ type: TokenListType['CUSTOM' | 'DEFAULT' | 'UPLOAD'] }>('SET_TOKEN_LIST_TYPE')

export const setNewIPFSCustomListAndUpdateBalances = (p1: { customTokenList: DefaultTokenObject[] }, p2: {}) => async (dispatch: Function, getState: () => State) => {
  dispatch(batchActions([
    setCustomTokenList(p1),
    setIPFSFileHashAndPath(p2),
  ], 'BATCH_SET_CUSTOM_LIST_AND_IPFS_HASH_PATH'))

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
