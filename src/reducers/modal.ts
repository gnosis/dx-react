import { openModal, closeModal } from 'actions/modal'
import { handleActions } from 'redux-actions'

const initialState = { 
  isOpen: false,
  modalName: undefined as string,
  modalProps: undefined as any,
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
