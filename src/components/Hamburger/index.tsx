import React, { Component } from 'react'
import { handleKeyDown } from 'utils'
import { Link, NavLink } from 'react-router-dom'
import { URLS } from 'globals'

interface HamburgerProps {}
interface HamburgerState {
  isOpen: boolean;
}

export default class Hamburger extends Component<HamburgerProps, HamburgerState> {

  state = {
    isOpen: false,
  }

  handleClick = () => {
    document && document.body && document.body.classList.toggle('noScroll')

    return this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    const { isOpen } = this.state
    return (
      <div
        className="navParent"
        tabIndex={-1}
        onKeyDown={(e) => handleKeyDown(e, this.handleClick, 'Escape')}
      >
        {isOpen && <div className="navShadow" onClick={this.handleClick} />}
        <button className="hamburger" onClick={this.handleClick}></button>
        <nav className={isOpen ? 'show' : null}>
          <button
            className="buttonExit"
            onClick={this.handleClick}>
          </button>
          {window && window.location.hash !== '#/' && <Link to="/" onClick={this.handleClick}> Home </Link>}
          <NavLink to="/content/HowItWorks" onClick={this.handleClick}> How it Works </NavLink>
          {/* <NavLink to="/content/Screencast" onClick={this.handleClick}> Screencast </NavLink> */}
          <NavLink to="/content/Tokens" onClick={this.handleClick}> Tokens </NavLink>
          <NavLink to="/content/Fees" onClick={this.handleClick}> Fees </NavLink>
          <NavLink to="/content/FAQ" onClick={this.handleClick}> FAQ </NavLink>
          {/* <NavLink to="/content/Technical" onClick={this.handleClick}> Technical </NavLink> */}
          {/* <NavLink to="/content/Downtime" onClick={this.handleClick}> Downtime </NavLink> */}
          {/*  <a href={URLS.MARKET_MAKERS} target="_blank" onClick={this.handleClick}> Market Makers </a>
          <a href={URLS.LISTING_A_TOKEN} target="_blank" onClick={this.handleClick}> Listing a Token </a> */}
          <NavLink to="/content/Help" onClick={this.handleClick}> Help </NavLink>
          <p><i>For</i> Market Makers & Listing a Token <i>visit</i>:</p>
          <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank" onClick={this.handleClick}> Devs & API </a>
        </nav>
      </div>
    )
  }
}
