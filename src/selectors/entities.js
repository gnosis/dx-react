import _ from 'lodash'

export const entitySelector = (state, entityType) => _.get(state, `entities['${entityType}']`, {})
