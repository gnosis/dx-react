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
      <div
        className="navParent"
        tabIndex={-1}
        onKeyDown={(e) => handleKeyDown(e, this.handleClick, 'Escape')}
      >
        <button className="hamburger" onClick={this.handleClick}></button>
        <nav className={isOpen ? 'show' : null}>
          <button
            className="buttonExit"
            onClick={this.handleClick}>
          </button>
          <Link to="/content/HowItWorks"> How It Works </Link>
          <Link to="/content/Screencast">Screencast</Link>
          <Link to="/content/Tokens">Tokens </Link>
          <Link to="/content/Fees">Fees</Link>
          <Link to="/content/FAQ">FAQ</Link>
          <Link to="/content/Technical">Technical </Link>
          <Link to="/content/Downtime">Downtime</Link>
          <Link to="/content/Help">Help</Link>
        </nav>
      </div>
    )
  }
}
