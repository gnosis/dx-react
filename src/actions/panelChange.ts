import { createAction } from 'redux-actions'
import { Dispatch } from 'react-redux'
import { push } from 'connected-react-router'
import { grabElementID } from 'containers/ContentPages'

// TODO: fill payload
export const continueToOrder = createAction<any>('CONTINUE_TO_ORDER', () => { })

export const pushAndMoveToElement = (sectionID: string, outsidePage?: string) => async (dispatch: Dispatch<any>) => {
  if (outsidePage) {
      await dispatch(push(outsidePage))
    }

  if (!sectionID) return

  if (Array.from(grabElementID(sectionID).classList).some((className: string) => className === 'active')) {
      return grabElementID(sectionID).scrollIntoView()
    }

  grabElementID(sectionID).classList.toggle('active')
  return grabElementID(sectionID).scrollIntoView()
}
