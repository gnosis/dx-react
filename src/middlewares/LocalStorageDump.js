import { pick } from 'lodash'

const CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE'

const PERSIST_PATHS = [
  'transactions.log',
]

export default store => next => (action) => {
  const state = store.getState()

  if (action.type !== CLEAR_LOCAL_STORAGE) {
    let storage = {}

    PERSIST_PATHS.forEach((path) => {
      storage = {
        ...pick(state, path),
      }
    })

    // eslint-disable-next-line no-undef
    localStorage.setItem(`GNOSIS_${process.env.VERSION}`, JSON.stringify(storage))

    return next(action)
  }
  next(action)
  return null
}
