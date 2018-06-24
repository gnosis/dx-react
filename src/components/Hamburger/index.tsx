import React, { Component } from 'react'

interface HamburgerProps {}

interface HamburgerState {
  isOpen: boolean
}

export default class Hamburger extends Component<HamburgerProps, HamburgerState> {
  
  state = {
    isOpen: false,
  }

  handleClick = () => this.setState({
    isOpen: !this.state.isOpen,
  })

  render() {
    const { isOpen } = this.state

    return (
      <div>
        <button 
          className="hamburger"
          onClick={this.handleClick}></button>
        <nav className={isOpen ? 'show' : null}>
          <button 
            className="buttonExit"
            onClick={this.handleClick}>
          </button>
          <a href="#">How it works</a>
          <a href="#">About</a>
          <a href="#">Faq</a>
        </nav>
      </div>
    )  
  }
}
