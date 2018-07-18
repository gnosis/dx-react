// document.body.classList.add("home");

import { Middleware, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from 'types'

const NoScroll: Middleware = () => next => async (action: Action | ThunkAction<Action, Partial<State>, void>) => {
  const { type } = action as Action

  if (type !== 'CLOSE_MODAL' && type !== 'OPEN_MODAL') return next(action as Action)

  try {
    if (type === 'OPEN_MODAL') {
      document.body.classList.add('noScroll')
    } else if (type === 'CLOSE_MODAL') {
      document.body.classList.remove('noScroll')
    }

    return next(action as Action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }
}

export default NoScroll
