import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Router,
  Route,
  IndexRedirect,
} from 'react-router'

import App from 'containers/App'
import MarketListPage from 'containers/MarketListPage'
import MarketCreateWizardPage from 'containers/MarketCreateWizardPage'
import MarketDetailPage from 'containers/MarketDetailPage'
import TransactionsPage from 'containers/TransactionsPage'
import AccountPage from 'containers/AccountPage'
import SettingsPage from 'containers/SettingsPage'
import DashboardPage from 'containers/DashboardPage'
import MarketCreateReviewPage from 'containers/MarketCreateReviewPage'

class AppRouter extends Component {
  static propTypes = {
    history: PropTypes.object,
  }

  render() {
    const { history } = this.props

    return (
      <Router key={Math.random()} history={history}>
        <Route path="/" component={App}>
          <IndexRedirect to="dashboard" />
          <Route path="dashboard" component={DashboardPage} />
          <Route path="transactions" component={TransactionsPage} />
          <Route path="account" component={AccountPage} />
          <Route path="settings" component={SettingsPage} />
          <Route path="markets">
            <IndexRedirect to="list" />
            <Route path="new" component={MarketCreateWizardPage} />
            <Route path="review" component={MarketCreateReviewPage} />
            <Route path="list" component={MarketListPage} />
            <Route path=":id" component={MarketDetailPage}>
              <Route path=":view">
                <Route path=":shareId">
                  <Route path="sell" component={MarketDetailPage} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Router>
    )
  }

}

export default AppRouter
