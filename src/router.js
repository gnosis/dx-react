import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Router,
  Route,
} from 'react-router'

// import App from 'containers/App'
import DavidTest from 'containers/_DavidTest'

class AppRouter extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  render() {
    const { history } = this.props

    return (
      // Math.random key = HMR router reload issue
      <Router key={Math.random()} history={history}>
        <Route path="/" component={DavidTest} />
      </Router>
    )
  }

}

export default AppRouter
