import { createAction } from 'redux-actions'
import { BigNumber } from 'types'

export const setTokenBalance = createAction<{address: string, balance: BigNumber}>('SET_TOKEN_BALANCE')
