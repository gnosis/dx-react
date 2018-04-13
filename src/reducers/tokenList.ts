import { handleActions } from 'redux-actions'

import { setDefaultTokenList, setCustomTokenList } from 'actions'

export default handleActions(
  {
    [setDefaultTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      defaultTokenList: action.payload.defaultTokenList,
    }),
    [setCustomTokenList.toString()]: (state: any, action: any) => ({
      ...state,
      customTokenList: action.payload.customTokenList,
    }),
  },
  {
    defaultTokenList: undefined,
    customTokenList: undefined,
  },
)
