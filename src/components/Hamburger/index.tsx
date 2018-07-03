import React, { Component } from 'react'
import { handleKeyDown } from 'utils/helpers'
import { Link } from 'react-router-dom'

interface HamburgerProps {}
interface HamburgerState {
  isOpen: boolean;
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
          {window && window.location.pathname !== '/' && <Link to="/" onClick={this.handleClick}> Home </Link>}
          <Link to="/content/HowItWorks" onClick={this.handleClick}> How It Works </Link>
          <Link to="/content/Screencast" onClick={this.handleClick}> Screencast </Link>
          <Link to="/content/Tokens" onClick={this.handleClick}> Tokens </Link>
          <Link to="/content/Fees" onClick={this.handleClick}> Fees </Link>
          <Link to="/content/FAQ" onClick={this.handleClick}> FAQ </Link>
          <Link to="/content/Technical" onClick={this.handleClick}> Technical </Link>
          <Link to="/content/Downtime" onClick={this.handleClick}> Downtime </Link>
          <Link to="/content/Help" onClick={this.handleClick}> Help </Link>
        </nav>
      </div>
    )
  }
}
