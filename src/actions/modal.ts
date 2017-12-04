import { createAction } from 'redux-actions'

export const openModal = createAction<{modalName: string, modalProps: any}>('OPEN_MODAL')
export const closeModal = createAction('CLOSE_MODAL')
