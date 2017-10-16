import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import {
    Route,
    NavLink,
} from 'react-router-dom'
import { History } from 'history'

// import App from 'containers/App'
import BalanceButton from 'contract-fe-test/containers/BalanceButton'
import { getDutchXConnection } from 'contract-fe-test/api/dutchx'

const TempApp = () => (
    <div>
        <h1>Truffle + React/Redux</h1>
        <h2>Connect testRPC via a terminal first...</h2>
        <BalanceButton dutchXInst={getDutchXConnection} />
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
