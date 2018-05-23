import { Middleware, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from 'types'

const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

const LocalStorageLoads: Middleware = store => next => (action: Action | ThunkAction<Action, Partial<State>, void>) => {
  const { type } = action as Action

  if (type !== 'INIT') return next(action as Action)

  try {
    const storedState = JSON.parse(
      // eslint-disable-next-line
      window.localStorage.getItem(`GNOSIS_${process.env.VERSION}`),
    )

    if (storedState) {
      store.dispatch({
        type: LOAD_LOCALSTORAGE,
        payload: storedState,
      })
    }

    return next(action as Action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }
}

export default LocalStorageLoads
