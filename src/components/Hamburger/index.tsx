import React, { Component } from 'react'
import { handleKeyDown } from 'utils'
import { Link, NavLink, Route } from 'react-router-dom'
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
    document && document.body && document.body.classList.toggle('noScrollAll')

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
          <Route path="/(.+)" render={() => <Link to="/" onClick={this.handleClick}> Home </Link>}/>
          <NavLink to="/content/HowItWorks" onClick={this.handleClick}> How it Works </NavLink>
          <a href={URLS.STEP_BY_STEP_GUIDE} target="_blank" rel="noopener noreferrer" onClick={this.handleClick}>Step By Step Guide</a>
          <NavLink to="/content/Tokens" onClick={this.handleClick}> Tokens </NavLink>
          <NavLink to="/content/LiquidityContribution" onClick={this.handleClick}> Liquidity Contribution </NavLink>
          <NavLink to="/content/FAQ" onClick={this.handleClick}> FAQ </NavLink>
          <NavLink to="/content/Help" onClick={this.handleClick}> Help </NavLink>
          {/* <a href={URLS.MGN_POOL} target="_blank">POOL</a> */}
          {/* Market Makers and Listing a Token */}
          <p>For <i>Market Makers & Listing a Token</i> visit: <a href={URLS.DUTCHX_DEVS_AND_API} target="_blank" rel="noopener noreferrer" onClick={this.handleClick}> Devs & API </a></p>

          {document.body.classList.contains('THEME') && <Link to="" onClick={() => document.body.classList.toggle('RETROX')}> THEME ON/OFF </Link>}
        </nav>
      </div>
    )
  }
}
