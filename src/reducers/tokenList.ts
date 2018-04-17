import { handleActions } from 'redux-actions'

import { setDefaultTokenList, setCustomTokenList } from 'actions'
import { setTokenListType } from 'containers/TokenUpload'
import { DefaultTokenObject } from 'api/types'

import { createSelector } from 'reselect'

const makeASet = createSelector(
  (state: any, action: any) => action.payload.defaultTokenList || state.defaultTokenList,
  list => new Set(list.map((t: DefaultTokenObject) => t.address)),
)
const copyList = createSelector(
  (state: any, action: any) => action.payload.defaultTokenList || state.defaultTokenList,
  list => list.slice(),
)

const combine = createSelector(
  makeASet,
  copyList,
  (state, action) => action.payload.customTokenList || state.customTokenList,
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
      combinedTokenList: combine(state, action),
    }),
    [setCustomTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      customTokenList: action.payload.customTokenList,
      combinedTokenList: combine(state, action),
    }),
    [setTokenListType.toString()]: (state: any, action: any) => {
      const { type } = action.payload
      return {
        ...state,
        type,
      }
    },
  },
  {
    defaultTokenList: [],
    customTokenList: [],
    combinedTokenList: [],
    type: undefined,
  },
)
