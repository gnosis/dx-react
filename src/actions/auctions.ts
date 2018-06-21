import { createAction } from 'redux-actions'
import { AuctionsState } from 'types';

export const setOngoingAuctions = createAction<Partial<AuctionsState>>('SET_ONGOING_AUCTIONS')
export const setAvailableAuctions = createAction<string[]>('SET_AVAILABLE_AUCTIONS')
