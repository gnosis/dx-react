import { handleActions, Action } from 'redux-actions'

import { setOngoingAuctions, setAvailableAuctions, resetAppState } from 'actions'
import { AuctionsState } from 'types'

export const reducer = handleActions(
  {
    [setOngoingAuctions.toString()]: (state: AuctionsState, action: any) => {
      const { ongoingAuctions } = action.payload
      console.log('ongoingAuctions: ', ongoingAuctions);
      return {
        ...state,
        ongoingAuctions,
      }
    },
    [setAvailableAuctions.toString()]: (state: AuctionsState, action: Action<string[]>) => ({
      ...state,
      availableAuctions: new Set(action.payload),
    }),
    [resetAppState.toString()]: (state: AuctionsState) => ({
      ...state,
      ongoingAuctions: [],
      availableAuctions: new Set(),
    }),
  },
  {
    ongoingAuctions: [],
    availableAuctions: new Set(),
  },
)

export default reducer
