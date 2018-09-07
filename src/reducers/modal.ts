import { openModal, closeModal } from 'actions/modal'
import { handleActions } from 'redux-actions'
import { Modal } from 'types'

const initialState: Modal = {
  isOpen: false,
  modalName: undefined,
  modalProps: undefined,
}

const reducer = handleActions(
  {
    [openModal.toString()]: (state, action) => {
      const { modalName, modalProps } = action.payload

      return {
        ...state,
        modalName,
        modalProps,
        isOpen: true,
      }
    },
    [closeModal.toString()]: () => initialState,
  },
  initialState,
)

export default reducer
