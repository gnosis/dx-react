import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Redirect, StaticRouter, Switch } from 'react-router-dom'
import { History } from 'history'
import { hot } from 'react-hot-loader'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Home from 'containers/Home'
import PageNotFound from 'components/PageNotFound'
import OrderPanel from 'containers/OrderPanel'
import WalletPanel from 'containers/WalletPanel'
import AuctionPanel from 'containers/AuctionPanel'
import ContentPageContainer from 'containers/ContentPages'
import Cookies from 'components/Cookies'
import Imprint from 'components/Imprint'

import GoogleAnalyticsTracking from 'components/GoogleAnalyticsTracking'
import WalletIntegration from 'containers/WalletIntegration'
import AppValidator from 'containers/AppValidator'
import RedirectToDisclaimer from 'containers/RedirectToDisclaimer'
import Disclaimer from 'containers/Disclaimer'
import Terms from 'components/Terms'

interface AppRouterProps {
  history: History;
  analytics: boolean;
  disabled?: boolean;
}

// TODO: consider redirecting from inside /order, /wallet, /auction/:nonexistent_addr to root
const withHeaderAndFooter = (Component: React.ComponentClass | React.SFC, content?: boolean) => (props: any) => (
  <>
    <Header content={content}/>
    <Component {...props}/>
    <Footer />
  </>
)

const HomeWH = withHeaderAndFooter(Home)
const OrderPanelWH = withHeaderAndFooter(OrderPanel)
const WalletPanelWH = withHeaderAndFooter(WalletPanel)
const AuctionPanelWH = withHeaderAndFooter(AuctionPanel)
// true passed in to show different, solidBackgorund Header
const ContentPageContainerWH = withHeaderAndFooter(ContentPageContainer, true)
const CookiesWH = withHeaderAndFooter(Cookies, true)
const ImprintWH = withHeaderAndFooter(Imprint, true)
const TermsWH = withHeaderAndFooter(Terms, true)

const AppRouter: React.SFC<AppRouterProps> = ({ analytics, history, disabled }) => {
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
      <div className="appFlex">

        <RedirectToDisclaimer/>
        <Switch>
          <Route path="/verification" component={Disclaimer} />
          <WalletIntegration>
            <AppValidator>
              <Switch>
                <Route exact path="/" component={HomeWH} />
                <Route path="/order" component={OrderPanelWH} />
                <Route path="/wallet" component={WalletPanelWH} />

                {/* TODO: check for valid params.addr and redirect if necessary */}
                <Route path="/auction/:sell-:buy-:index" component={AuctionPanelWH} />

                <Route path="/cookies" component={CookiesWH} />
                <Route path="/imprint" component={ImprintWH}/>
                <Route path="/terms" component={TermsWH}/>
                {/* TODO: change to privacy */}
                <Redirect from="/privacy" to="/" />

                <Route path="/content/:contentPage" component={ContentPageContainerWH} />
                <Redirect from="/content" to="/content/HowItWorks" />

                <Route path="/404" component={PageNotFound} />
                <Redirect to="/404" />

              </Switch>
            </AppValidator>
          </WalletIntegration>
        </Switch>

        {analytics && <GoogleAnalyticsTracking />}
      </div>
  </ConnectedRouter>
  )
}

export default hot(module)(AppRouter)
