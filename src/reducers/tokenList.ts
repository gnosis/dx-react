import { handleActions } from 'redux-actions'

import { setDefaultTokenList, setCustomTokenList, setTokenListType } from 'actions'
import { DefaultTokenObject } from 'api/types'

import { createSelector } from 'reselect'

const makeASet = createSelector(
  (state: any) => state.combinedTokenList,
  list => new Set(list.map((t: DefaultTokenObject) => t.address)),
)
const copyList = createSelector(
  (state: any) => state.combinedTokenList,
  list => list.slice(),
)

const combine = createSelector(
  // addresses of defaultTokens in Set
  makeASet,
  // copy of defaultTokensList
  copyList,
  // customTokensList uploaded by user
  (_: never, action: any) => action.payload.customTokenList || action.payload.defaultTokenList,
  // filter through customTokenList and remove dup addresses AGAINST Set
  (set, list, list2) => {
    for (const token of list2) {
      if (!set.has(token.address)) list.push(token)
    }

    return list
  },
)

export default handleActions(
  {
    [setDefaultTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      defaultTokenList: action.payload.defaultTokenList,
      combinedTokenList: combine(state,action),
    }),
    [setCustomTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      customTokenList: action.payload.customTokenList,
      combinedTokenList: combine(state, action),
    }),
    [setTokenListType.toString()]: (state: any, action: any) => ({
      ...state,
      type: action.payload.type,
    }),
  },
  {
    defaultTokenList:   [],
    customTokenList:    [],
    combinedTokenList:  [],
    type: 'UPLOAD',
  },
)
