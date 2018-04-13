import { createAction } from 'redux-actions'
import { TokenCode } from 'types'

export const setApprovedTokens = createAction<TokenCode[]>('SET_APPROVED_TOKENS')
