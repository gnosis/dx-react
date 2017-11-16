import { createAction } from 'redux-actions'

export const setTokenBalance = createAction<{tokenName: string, balance: string}>('SET_TOKEN_BALANCE')
