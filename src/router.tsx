import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import {
    Route,
    NavLink,
} from 'react-router-dom'
import { History } from 'history'

// import App from 'containers/App'

const TempApp = () => (
    <div>
        <h2>Hello World!</h2>
    </div>
)

interface AppRouterProps {
    history: History
}

const AppRouter: React.SFC<AppRouterProps> = ({ history }) => (
    <ConnectedRouter history={history}>
        <div>
            <NavLink to="/">Home</NavLink>{' '}
            <NavLink to="/someroute">Some Route</NavLink>
            <Route exact path="/" component={TempApp} />
            <Route path="/someroute" render={() => <h3>Some Route</h3>} />
        </div>
    </ConnectedRouter>
)


export default AppRouter
