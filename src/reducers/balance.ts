import { handleActions } from 'redux-actions'

import { getBalanceBase } from 'actions/balance'

export const reducer = handleActions({
  [getBalanceBase as any]: (state: any, action: any) => {
    const { reqBalance, success } = action.payload
    return {
      ...state,
      currentBalance: reqBalance,
      success,
    }
  },
},
  {
    currentBalance: null,
    success: null,
  })

export default reducer
