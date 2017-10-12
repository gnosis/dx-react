import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Router,
  Route,
} from 'react-router'

// import App from 'containers/App'
import BalanceButton from 'contract-fe-test/containers/BalanceButton'

const TempApp = () => (
  <div>
    <h1>Truffle + React/Redux</h1>
    <h2>Connect testRPC via a terminal first...</h2>
    <BalanceButton />
  </div>
)

class AppRouter extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  render() {
    const { history } = this.props

    return (
      // Math.random key = HMR router reload issue
      <Router key={Math.random()} history={history}>
        {/* <Route path="/" component={App} /> */}
        <Route path="/" component={TempApp} />
      </Router>
    )
  }

}

export default AppRouter
