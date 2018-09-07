import React from 'react'

import { storiesOf } from '@storybook/react'
import StoryRouter from 'storybook-router'

import { storeInit, makeProviderDecorator } from './helpers'

// import ModalContainer from 'containers/Modals'
// import Home from 'containers/Home'
import { ApprovalModal, TransactionModal } from 'components/Modals'

// const CenterDecor = makeCenterDecorator({
//   style: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
// })

const modalState = {
  modalName: 'TransactionModal',
  modalProps: {
    header: 'Transaction in Progress',
    body: 'Please accept transaction',
  },
  isOpen: true,
} as any

const Provider = makeProviderDecorator(storeInit(modalState))

storiesOf('Modal', module)
  .addDecorator(StoryRouter())
  .addDecorator(Provider)
  .addWithJSX('Transaction Modal', () => <TransactionModal {...modalState}/>)
  .addWithJSX('Approval Modal', () => <ApprovalModal {...modalState}/>)
