import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'

import { setIPFSFileHashAndPath } from 'actions/ipfs'
import { TokenListType } from 'types'
import { DefaultTokenObject } from 'api/types'

export const setDefaultTokenList = createAction<{ defaultTokenList: DefaultTokenObject[] }>('SET_DEFAULT_TOKEN_LIST')
export const setCustomTokenList = createAction<{ customTokenList: DefaultTokenObject[] | any[] }>('SET_CUSTOM_TOKEN_LIST')

export const setTokenListType = createAction<{ type: TokenListType['CUSTOM' | 'DEFAULT' | 'UPLOAD'] }>('SET_TOKEN_LIST_TYPE')

export const batchTokenListTypeAndFileParams = (p1: { customTokenList: DefaultTokenObject[] }, p2: {}) => batchActions([
  setCustomTokenList(p1),
  setIPFSFileHashAndPath(p2),
  setTokenListType({ type: 'CUSTOM' }),
])
