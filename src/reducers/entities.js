import { handleActions } from 'redux-actions'
import { keys, set, get } from 'lodash'

import {
  updateEntity,
  receiveEntities,
  removeEntity,
} from 'actions/entities'

const reducer = handleActions({
  [updateEntity]: (state, action) => ({
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.data.id]: {
        ...get(state, `[${action.payload.entityType}][${action.payload.data.id}]`, {}),
        ...action.payload.data,
      },
    },
  }),
  [receiveEntities]: (state, action) => {
    const result = { ...state }
    keys(action.payload.entities).forEach((entityType) => {
      // preserve old entities
      const entitiesState = get(state, `${entityType}`, {})
      set(result, `${entityType}`, entitiesState)

      keys(action.payload.entities[entityType]).forEach((entityId) => {
        // preserve old entity (only update if not exists)
        const entityState = get(state, `${entityType}.${entityId}`, {})
        set(result, `${entityType}.${entityId}`, {
          ...entityState,
          ...action.payload.entities[entityType][entityId],
        })
      })
    })
    return result
  },
  [removeEntity]: (state, action) => {
    const { ...rest } = state[action.payload.entityType]
    return {
      ...state,
      [action.payload.entityType]: { ...rest } }
  },
}, {})


export default reducer
