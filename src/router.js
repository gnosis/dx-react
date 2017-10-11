import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Router,
  Route,
} from 'react-router'

// import App from 'containers/App'

const TempApp = () => (
  <div>
    <h2>Hello World!</h2>
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
