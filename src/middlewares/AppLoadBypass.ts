// action.type: @@router/LOCATION_CHANGE
// action.payload: location.pathname === '/cookies'

import { Middleware, Action } from 'redux'
import { createAction } from 'redux-actions'
import { State } from 'types'

export const setAppLoadBypass = createAction<boolean>('SET_APP_LOAD_BYPASS')

const AppLoadBypass = ({ dispatch, getState }: { dispatch: Function, getState: () => State }) => (next: Function) => async (action: any) => {
  const { payload, type } = action as { payload: any, type: string }
  const { router: { location: { pathname } }, blockchain: { activeProvider } }: any = getState()

  if (!activeProvider || type !== '@@router/LOCATION_CHANGE') return next(action as Action)

  const pathMatch = (toCheck: string, match: boolean = true) =>
        match
            ?
        (toCheck === '/cookies' || toCheck.includes('/content/'))
            :
        (toCheck !== '/cookies' && !toCheck.includes('/content/'))

  try {
    if (pathMatch(pathname)) {
        console.debug('LOCATION MATCH')
        if (
                pathMatch(payload.location.pathname, false)
            ) {
            dispatch(setAppLoadBypass(true))
          }
      } else {
        console.debug('LOCATION MIS-MATCH')
        dispatch(setAppLoadBypass(false))
      }

    return next(action as Action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }
}

export default AppLoadBypass as Middleware
