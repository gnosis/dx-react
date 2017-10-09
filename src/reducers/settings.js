import { handleActions } from 'redux-actions'

import { updateSettings } from 'actions/settings'

const reducer = handleActions({
  [updateSettings]: (state, action) => {
    const data = action.payload
    const result = { mapping: {} }
    data.map((item) => {
      if (item.address && item.name) {
        result.mapping[item.address] = item.name
      }
    })
    return result
  },
}, { mapping: {} })

export default reducer
