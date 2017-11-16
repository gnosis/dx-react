import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router-dom'
import { History } from 'history'

import Header from 'components/Header'
import Home from 'containers/Home'


interface AppRouterProps {
  history: History
}

const AppRouter: React.SFC<AppRouterProps> = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Header />
      <Route exact path="/" component={Home} />
      <Route path="/someroute" render={() => <h3>Some Route</h3>} />
    </div>
  </ConnectedRouter>
)


export default AppRouter
