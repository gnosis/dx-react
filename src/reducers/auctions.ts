import { handleActions } from 'redux-actions'

import { setOngoingAuctions } from 'actions'

export const reducer = handleActions(
  {
    [setOngoingAuctions.toString()]: (state: any, action: any) => {
      const { ongoingAuctions } = action.payload
      return {
        ...state,
        ongoingAuctions,
      }
    },
  },
  {
    ongoingAuctions: []
  },
)

export default reducer
