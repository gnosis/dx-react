import React, { Component } from 'react'

import { connect } from 'react-redux'
import { closeModal, approveAndPostSellOrder } from 'actions'

import { history } from 'index'

import { Balance, State } from 'types'  

import * as Modals from 'components/Modals'

export interface ModalContainerProps {
  activeProvider: any,
  children?: any,

  isOpen: boolean,
  modalName: string,
  modalProps: any,

  closeModal?(): any,
  submitSellOrder?(): any,
}

const backdropActive: any = {
  zIndex: 100,
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,

  backgroundColor: '#00000091',
}

const blurred: any = {
  filter: 'blur(4px)',

  pointerEvents: 'none', userSelect: 'none',
}

const Aux = (props: any) => props.children

let unblock : Function

class ModalContainer extends Component<ModalContainerProps> {

  componentWillReceiveProps(nextProps: any) {
    const { isOpen } = this.props
        
    // If MODAL is OPEN block movement
    if (nextProps.isOpen !== isOpen && nextProps.isOpen) {
      unblock = history.block(`Are you sure you want to leave this page? You have not yet confirmed or rejected your sell order.` as any)
      // unblock
    }

    // Unblock Movement
    if (nextProps.isOpen !== isOpen && !nextProps.isOpen) {
      // calls return fn from unblock
      unblock()
    }

    return false
  }

  renderSpecificModal = (): null | Error | JSX.Element => {
    const { modalName, isOpen, ...rest } = this.props
    let Modal

    if (isOpen) {
      Modal = Modals[modalName]

      if (!modalName) {
        return new Error('No correct modal')
      }

      return (
        <div style={backdropActive}>
          <Modal {...rest}/>
        </div>
      )
    }
    return null
  }
  
  render() {
    const { children, isOpen } = this.props

    return (
      <Aux>
        {isOpen ? <div style={blurred}>{children}</div> : children}
        {this.renderSpecificModal()}
      </Aux>
    )
  }
}

const mapState = ({
  blockchain,
  modal: { 
    modalName, 
    modalProps, 
    isOpen, 
  },
}: State) => ({
  activeProvider: blockchain.activeProvider,
  
  isOpen,
  modalName,
  modalProps,
})

export default connect<ModalContainerProps>(mapState, { closeModal, approveAndPostSellOrder })(ModalContainer)
