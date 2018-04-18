import { createAction } from 'redux-actions'
import { BigNumber } from 'types'

export const setTokenBalance = createAction<{tokenName: string, balance: BigNumber | string}>('SET_TOKEN_BALANCE')
