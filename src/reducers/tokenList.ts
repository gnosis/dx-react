import { handleActions } from 'redux-actions'

import { setDefaultTokenList, setCustomTokenList } from 'actions'
import { setTokenListType } from 'containers/TokenUpload'

export default handleActions(
  {
    [setDefaultTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      defaultTokenList: action.payload.defaultTokenList,
      combinedTokenList: [
        ...state.customTokenList,
        ...action.payload.defaultTokenList,
      ],
    }),
    [setCustomTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      customTokenList: action.payload.customTokenList,
      combinedTokenList: [
        ...state.defaultTokenList,
        ...state.customTokenList,
        ...action.payload.customTokenList,
      ],
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
