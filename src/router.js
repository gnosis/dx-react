import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Router,
  Route,
} from 'react-router'

import App from 'containers/App'

class AppRouter extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  render() {
    const { history } = this.props

    return (
        // TODO - ask about Math.random()
      <Router key={Math.random()} history={history}>
        <Route path="/" component={App} />
      </Router>
    )
  }

}

export default AppRouter
