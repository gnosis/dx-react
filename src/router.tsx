import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router-dom'
import { History } from 'history'

import Header from 'components/Header'
import Home from 'containers/Home'
import OrderPanel from 'containers/OrderPanel'
import WalletPanel from 'containers/WalletPanel'
import AuctionPanel from 'containers/AuctionPanel'


interface AppRouterProps {
  history: History
}

// TODO: consider redirecting from inside /order, /wallet, /auction/:nonexistent_addr to root

const AppRouter: React.SFC<AppRouterProps> = ({ history }) => (
  <ConnectedRouter history={history}>
    <div>
      <Header />
      <Route exact path="/" component={Home} />
      <Route path="/order" component={OrderPanel} />
      <Route path="/wallet" component={WalletPanel} />
      {/* TODO: check for valid params.addr and redirect if necessary */}
      <Route path="/auction/:sell-:buy-:index" component={AuctionPanel} />
    </div>
  </ConnectedRouter>
)


export default AppRouter
