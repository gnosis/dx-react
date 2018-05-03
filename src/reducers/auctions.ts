import { handleActions } from 'redux-actions'

import { setOngoingAuctions, resetAppState } from 'actions'
import { State } from 'types'

export const reducer = handleActions(
  {
    [setOngoingAuctions.toString()]: (state: Pick<State, 'ongoingAuctions'>, action: any) => {
      const { ongoingAuctions } = action.payload
      return {
        ...state,
        ongoingAuctions,
      }
    },
    [resetAppState.toString()]: (state: Pick<State, 'ongoingAuctions'>) => ({
      ...state,
      ongoingAuctions: [],
    }),
  },
  {
    ongoingAuctions: [],
  },
)

export default reducer
