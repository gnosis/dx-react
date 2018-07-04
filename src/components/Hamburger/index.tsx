import React, { Component } from 'react'
import { handleKeyDown } from 'utils/helpers'
import { Link, NavLink } from 'react-router-dom'

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
          <NavLink to="/content/HowItWorks" onClick={this.handleClick}> How It Works </NavLink>
          <NavLink to="/content/Screencast" onClick={this.handleClick}> Screencast </NavLink>
          <NavLink to="/content/Tokens" onClick={this.handleClick}> Tokens </NavLink>
          <NavLink to="/content/Fees" onClick={this.handleClick}> Fees </NavLink>
          <NavLink to="/content/FAQ" onClick={this.handleClick}> FAQ </NavLink>
          <NavLink to="/content/Technical" onClick={this.handleClick}> Technical </NavLink>
          <NavLink to="/content/Downtime" onClick={this.handleClick}> Downtime </NavLink>x`
          <NavLink to="/content/Help" onClick={this.handleClick}> Help </NavLink>
        </nav>
      </div>
    )
  }
}
