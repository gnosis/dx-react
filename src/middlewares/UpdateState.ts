import { Action, Middleware } from 'redux'
import { updateMainAppState } from 'actions'
import { ThunkAction } from 'redux-thunk'
import { State } from 'types'

const UpdateState: Middleware = store => next => async (action: Action | ThunkAction<Action, Partial<State>, void>) => {
  if ((action as Action).type !== 'SAVE_LOG') return next(action as Action)

  const nextAction = next(action as Action)

  try {
      console.warn(`
            UPDATE_STATE_MIDDLEWARE FIRING
        `)
      await store.dispatch(updateMainAppState() as () => Promise<any>)
      return nextAction
    } catch (error) {
      console.error(error)
      return nextAction
    }
}

export default UpdateState
