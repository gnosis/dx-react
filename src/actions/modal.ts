import { createAction } from 'redux-actions'
import { Modal } from 'types'

export const openModal = createAction<Partial<Modal>>('OPEN_MODAL')
export const closeModal = createAction('CLOSE_MODAL')
