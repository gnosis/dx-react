import { createAction } from 'redux-actions'
import { TokenPair } from 'types'

export const selectTokenPair = createAction<TokenPair>('SELECT_TOKEN_PAIR')
