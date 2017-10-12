import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import {
  Route,
  NavLink,
} from 'react-router-dom'

// import App from 'containers/App'

const TempApp = () => (
  <div>
    <h2>Hello World!</h2>
  </div>
)

const AppRouter = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <NavLink to="/">Home</NavLink>{' '}
      <NavLink to="/someroute">Some Route</NavLink>
      <Route exact path="/" component={TempApp} />
      <Route path="/someroute" render={() => <h3>Some Route</h3>} />
    </div>
  </ConnectedRouter>
)

AppRouter.propTypes = {
  history: PropTypes.object.isRequired,
}

export default AppRouter
