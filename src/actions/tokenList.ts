import { createAction } from 'redux-actions'
import { DefaultTokenObject } from 'api/types';

export const setDefaultTokenList = createAction<{ defaultTokenList: DefaultTokenObject[] }>('SET_DEFAULT_TOKEN_LIST')
export const setCustomTokenList = createAction<{ customTokenList: DefaultTokenObject[] | any[] }>('SET_CUSTOM_TOKEN_LIST')
