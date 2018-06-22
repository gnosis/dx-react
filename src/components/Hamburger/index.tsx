import React, { Component } from 'react'
import { handleKeyDown } from 'utils/helpers'
import { Link } from 'react-router-dom'

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
      <div tabIndex={-1} onKeyDown={(e) => handleKeyDown(e, this.handleClick, 'Escape')}>
        <button
          className="hamburger"
          onClick={this.handleClick}></button>
        <nav className={isOpen ? 'show' : null}>
          <button
            className="buttonExit"
            onClick={this.handleClick}>
          </button>
          <Link replace to="/content/HowItWorks"> How It Works </Link>
          <Link replace to="/content/Screencast">Screencast</Link>
          <Link replace to="/content/Tokens">Tokens </Link>
          <Link replace to="/content/Fees">Fees</Link>
          <Link replace to="/content/FAQ">FAQ</Link>
          <Link replace to="/content/Technical">Technical </Link>
          <Link replace to="/content/Downtime">Downtime</Link>
          <Link replace to="/content/Help">Help</Link>
        </nav>
      </div>
    )
  }
}
