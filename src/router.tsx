import React, { Fragment } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router-dom'
import { History } from 'history'
import { hot } from 'react-hot-loader'

import Header from 'components/Header'
import Home from 'containers/Home'
import PageNotFound from 'containers/PageNotFound'
import Disclaimer from 'containers/Disclaimer'
import OrderPanel from 'containers/OrderPanel'
import WalletPanel from 'containers/WalletPanel'
import AuctionPanel from 'containers/AuctionPanel'

import { StaticRouter, Switch } from 'react-router-dom'


interface AppRouterProps {
  history: History;
  disabled?: boolean;
}

// TODO: consider redirecting from inside /order, /wallet, /auction/:nonexistent_addr to root

// const WithHeader = () => (
//   <Fragment>
//     <Header />
//     <Route exact path="/" component={Home} />
//     <Route path="/order" component={OrderPanel} />
//     <Route path="/wallet" component={WalletPanel} />
//   </Fragment>
// )

const withHeader = (Component: React.ComponentClass) => (props: any) => (
  <Fragment>
    <Header/>
    <Component {...props}/>
  </Fragment>
)

const HomeWH = withHeader(Home)
const OrderPanelWH = withHeader(OrderPanel)
const WalletPanelWH = withHeader(WalletPanel)
const AuctionPanelWH = withHeader(AuctionPanel)


const AppRouter: React.SFC<AppRouterProps> = ({ history, disabled }) => {
  if (disabled) {
    return (
      <StaticRouter context={{}}>
        <div>
          <Header />
          <Home showPicker/>
        </div>
      </StaticRouter>
    )
  }

  return (
    <ConnectedRouter history={history}>
      <div>
        {/* <Header /> */}
        <Switch>
          {/* <Route exact path="/" component={Home} /> */}
          <Route exact path="/" component={HomeWH} />
          <Route path="/order" component={OrderPanelWH} />
          <Route path="/wallet" component={WalletPanelWH} />
          {/* TODO: check for valid params.addr and redirect if necessary */}
          <Route path="/auction/:sell-:buy-:index" component={AuctionPanelWH} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
  </ConnectedRouter>
  )
}


export default hot(module)(AppRouter)
