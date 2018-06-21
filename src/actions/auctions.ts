import { createAction } from 'redux-actions'
import { OngoingAuctions } from 'types';

export const setOngoingAuctions = createAction<OngoingAuctions>('SET_ONGOING_AUCTIONS')
export const setAvailableAuctions = createAction<string[]>('SET_AVAILABLE_AUCTIONS')
