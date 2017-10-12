import { handleActions } from 'redux-actions'

import { getBalanceBase } from 'contract-fe-test/actions/Balance'

export const reducer = handleActions({
  [getBalanceBase]: (state, action) => {
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
