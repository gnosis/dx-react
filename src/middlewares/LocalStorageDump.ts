import { pick } from 'lodash'
import { Middleware, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from 'types'

const CLEAR_LOCAL_STORAGE = 'CLEAR_LOCAL_STORAGE'

const PERSIST_PATHS = [
  'transactions.log',
]

const LocalStorageDump: Middleware = store => next =>
  (action: Action | ThunkAction<Action, Partial<State>, void>) => {
    const state = store.getState()

    if ((action as Action).type !== CLEAR_LOCAL_STORAGE) {
      let storage = {}

      PERSIST_PATHS.forEach((path) => {
        storage = {
          ...storage,
          ...pick(state as any, path),
        }
      })

      // eslint-disable-next-line no-undef
      localStorage.setItem(`GNOSIS_${process.env.VERSION}`, JSON.stringify(storage))
    }
    return next(action as Action)
  }

export default LocalStorageDump
