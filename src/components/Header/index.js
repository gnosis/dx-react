import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import DecimalValue from 'components/DecimalValue'
import Identicon from 'components/Identicon'

import './header.less'

const Header = ({ version, defaultAccount, currentBalance, currentProvider, getProviderIcon }) => (
  <div className="headerContainer">
    <div className="container">
      <div className="headerContainer__group headerContainer__group--logo">
        <Link to="/">
          <div className="headerLogo" />
        </Link>
      </div>
      <div className="headerContainer__group headerContainer__group--left headerContainer__group--version">
        {version}
      </div>
      <div className="headerContainer__group headerContainer__group--left">
        <Link to="/dashboard" activeClassName="headerContainer__navLink--active" className="headerContainer__navLink">
          Dashboard
        </Link>
        <Link
          to="/markets/list"
          activeClassName="headerContainer__navLink--active"
          className="headerContainer__navLink"
        >
          Markets
        </Link>
        {defaultAccount && (
          <Link
            to="/transactions"
            activeClassName="headerContainer__navLink--active"
            className="headerContainer__navLink"
          >
            Transactions
          </Link>
        )}
      </div>
      <div className="headerContainer__group headerContainer__group--right account">
        {defaultAccount && currentProvider && getProviderIcon(currentProvider)}
        <div className="headerContainer__account">
          <DecimalValue value={currentBalance} className="headerContainer__account--text" />&nbsp;<span className="headerContainer__account--text">ETH</span>
          <Identicon className="" />
        </div>
      </div>
    </div>
  </div>
)

Header.propTypes = {
  version: PropTypes.string,
  defaultAccount: PropTypes.string,
  currentBalance: PropTypes.string,
  currentProvider: PropTypes.string,
  getProviderIcon: PropTypes.func,
}

export default Header
