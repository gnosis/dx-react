import { createAction } from 'redux-actions'
import { Account } from 'types'

export const setApprovedTokens = createAction<Account[]>('SET_APPROVED_TOKENS')
