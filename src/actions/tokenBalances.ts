import { createAction } from 'redux-actions'

export const setTokenBalance = createAction<{address: string, balance: string}>('SET_TOKEN_BALANCE')
