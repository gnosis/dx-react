import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import cn from 'classnames'
import Outcome from 'components/Outcome'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { add0xPrefix, weiToEth, getOutcomeName } from 'utils/helpers'
import { COLOR_SCHEME_DEFAULT, LOWEST_DISPLAYED_VALUE } from 'utils/constants'
import moment from 'moment'
import Decimal from 'decimal.js'
import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'
import config from 'config.json'

import './dashboard.less'

const EXPAND_DEPOSIT = 'DEPOSIT'

const controlButtons = {
  /*
  [EXPAND_DEPOSIT]: {
    label: 'Make Deposit',
    className: 'btn btn-primary',
    component: <span>Make Deposit</span>,
  },
  [EXPAND_WITHDRAW]: {
    label: 'Withdraw Money',
    className: 'btn btn-default',
    component: <span>Withdraw Money</span>,
  },
  */
}

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expandableSelected: undefined,
    }
  }

  componentWillMount() {
    if (this.props.gnosisInitialized) {
      this.props.requestMarkets()
      this.props.requestGasPrice()

      if (this.props.defaultAccount) {
        this.props.requestAccountShares(this.props.defaultAccount)
        this.props.requestAccountTrades(this.props.defaultAccount)
        this.props.requestEtherTokens(this.props.defaultAccount)
      }
    }
  }

  @autobind
  handleViewMarket(market) {
    this.props.changeUrl(`/markets/${market.address}`)
  }

  @autobind
  handleShowSellView(market, share) {
    this.props.changeUrl(`/markets/${market.address}/my-shares/${add0xPrefix(share.id)}`)
  }

  @autobind
  handleCreateMarket() {
    /*
    const options = {
      title: 'Test Market',
      description: 'Test123',
      outcomes: ['Yes', 'No'],
      resolutionDate: new Date().toISOString(),
      funding: new BigNumber('0.2345'),
      fee: new BigNumber('12.00'),
      eventType: 'CATEGORICAL',
      oracleType: 'CENTRALIZED',
    }

    this.props.createMarket(options)*/
    this.props.changeUrl('/markets/new')
  }

  @autobind
  handleExpand(type) {
    // Toggle
    this.setState({ visibleControl: this.state.visibleControl === type ? null : type })
  }

  renderExpandableContent() {
    const { visibleControl } = this.state

    if (visibleControl === EXPAND_DEPOSIT) {
      // const {
      //   market,
      //   selectedCategoricalOutcome,
      //   selectedBuyInvest,
      //   buyShares,
      // } = this.props

      return (
        <div className="expandable__inner">
          <div className="container">
            <span>Something comes here</span>
          </div>
        </div>
      )
    }

    return <div />
  }

  renderControls() {
    const { defaultAccount } = this.props
    const canCreateMarket = process.env.WHITELIST[defaultAccount] !== undefined
    return (
      <div className="dashboardControls container">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1 col-sm-12 col-sm-offset-0">
            {Object.keys(controlButtons).map(type => (
              <button
                key={type}
                type="button"
                className={`
                  dashboardControls__button
                  ${controlButtons[type].className}
                  ${type === this.state.visibleControl ? 'dashboardControls__button--active' : ''}`}
                onClick={() => this.handleExpand(type)}
              >
                {controlButtons[type].label}
              </button>
            ))}
            {canCreateMarket ? (
              <button
                type="button"
                onClick={this.handleCreateMarket}
                className="dashboardControls__button btn btn-default"
              >
                Create Market
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    )
  }

  renderNewMarkets(markets) {
    return markets.map(market => (
      <div
        className="dashboardMarket dashboardMarket--new"
        key={market.address}
        onClick={() => this.handleViewMarket(market)}
      >
        <div className="dashboardMarket__title">{market.eventDescription.title}</div>
        <Outcome market={market} opts={{ showOnlyTrendingOutcome: true, showDate: true, dateFormat: 'MMMM Y' }} />
      </div>
    ))
  }

  renderClosingMarkets(markets) {
    return markets.map(market => (
      <div
        className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns"
        key={market.address}
        onClick={() => this.handleViewMarket(market)}
      >
        <div className="dashboardMarket__leftCol">
          <div className="value">{moment.utc(market.eventDescription.resolutionDate).fromNow()}</div>
        </div>
        <div className="dashboardMarket__rightCol">
          <div className="dashboardMarket__title">{market.eventDescription.title}</div>
          <Outcome market={market} opts={{ showOnlyTrendingOutcome: true }} />
        </div>
      </div>
    ))
  }

  renderMyHoldings(holdings, markets) {
    return holdings.map((holding, index) => {
      const eventAddress = add0xPrefix(holding.outcomeToken.event)
      const filteredMarkets = markets.filter(market => market.event.address === eventAddress)
      const market = filteredMarkets.length ? filteredMarkets[0] : {}
      let probability = new Decimal(0)
      let maximumWin = new Decimal(0)
      // Check market is not empty
      if (market.event) {
        probability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
          funding: market.funding,
          outcomeTokenIndex: holding.outcomeToken.index,
        })
        maximumWin = calcLMSROutcomeTokenCount({
          netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
          funding: market.funding,
          outcomeTokenIndex: holding.outcomeToken.index,
          cost: holding.balance,
        })
      }

      return (
        <div className="dashboardMarket dashboardMarket--onDark" key={index}>
          <div className="dashboardMarket__title" onClick={() => this.handleViewMarket(market)}>
            {holding.eventDescription.title}
          </div>
          <div className="outcome row">
            <div className="col-md-3">
              <div
                className={'entry__color pull-left'}
                style={{ backgroundColor: COLOR_SCHEME_DEFAULT[holding.outcomeToken.index] }}
              />
              <div className="dashboardMarket--highlight pull-left">
                {getOutcomeName(market, holding.outcomeToken.index)}
              </div>
            </div>
            <div className="col-md-2 dashboardMarket--highlight">
              {Decimal(holding.balance)
                .div(1e18)
                .gte(LOWEST_DISPLAYED_VALUE) ? (
                  <DecimalValue value={weiToEth(holding.balance)} />
              ) : (
                `< ${LOWEST_DISPLAYED_VALUE}`
              )}
            </div>
            <div className="col-md-2 dashboardMarket--highlight">
              <DecimalValue value={maximumWin.mul(probability).div(1e18)} />&nbsp;
              {market.event ? <CurrencyName collateralToken={market.event.collateralToken} /> : <div />}
            </div>
            <div className="col-md-2 dashboardMarket--highlight">
              <a href="javascript:void(0);" onClick={() => this.handleShowSellView(market, holding)}>
                Sell
              </a>
            </div>
          </div>
        </div>
      )
    })
  }

  renderMyTrades(trades, markets) {
    return trades.map((trade, index) => {
      const eventAddress = add0xPrefix(trade.outcomeToken.event)
      const filteredMarkets = markets.filter(market => market.event.address === eventAddress)
      const market = filteredMarkets.length ? filteredMarkets[0] : {}
      let averagePrice
      if (trade.orderType === 'BUY') {
        averagePrice = parseInt(trade.cost, 10) / parseInt(trade.outcomeTokenCount, 10)
      } else {
        averagePrice = parseInt(trade.profit, 10) / parseInt(trade.outcomeTokenCount, 10)
      }

      return (
        <div
          className="dashboardMarket dashboardMarket--onDark"
          key={index}
          onClick={() => this.handleViewMarket(market)}
        >
          <div className="dashboardMarket__title">{trade.eventDescription.title}</div>
          <div className="outcome row">
            <div className="col-md-3">
              <div
                className={'entry__color pull-left'}
                style={{ backgroundColor: COLOR_SCHEME_DEFAULT[trade.outcomeToken.index] }}
              />
              <div className="dashboardMarket--highlight">{getOutcomeName(market, trade.outcomeToken.index)}</div>
            </div>
            <div className="col-md-2 dashboardMarket--highlight">
              {new Decimal(averagePrice).toFixed(4)}
              &nbsp;{market.event ? <CurrencyName collateralToken={market.event.collateralToken} /> : <div />}
            </div>
            <div className="col-md-3 dashboardMarket--highlight">
              {moment.utc(market.creationDate).format('MMMM Y')}
            </div>
            <div className="col-md-2 dashboardMarket--highlight">{trade.orderType}</div>
          </div>
        </div>
      )
    })
  }

  renderWidget(marketType) {
    const { markets, accountShares, accountTrades } = this.props
    const oneDayHours = 24 * 60 * 60 * 1000
    const whitelistedMarkets = markets.filter(market => process.env.WHITELIST[market.creator])
    const newMarkets = whitelistedMarkets.filter(market => new Date() - new Date(market.creationDate) < oneDayHours)
    /* const closingMarkets = markets.filter(
      market => moment.utc(market.eventDescription.resolutionDate).isBetween(moment(), moment().add(24, 'hours')),
    )*/
    let closingMarkets = whitelistedMarkets
      .filter(market => new Date() - new Date(market.eventDescription.resolutionDate) < 0)
      .sort((a, b) => a.eventDescription.resolutionDate > b.eventDescription.resolutionDate)

    if (marketType === 'newMarkets') {
      return (
        <div className="dashboardWidget col-md-6">
          <div className="dashboardWidget__market-title">New Markets</div>
          <div
            className={cn({
              dashboardWidget__container: true,
              'no-markets': !newMarkets.length,
            })}
          >
            {newMarkets.length ? this.renderNewMarkets(newMarkets) : "There aren't new markets"}
          </div>
        </div>
      )
    }

    if (marketType === 'closingMarkets') {
      if (closingMarkets.length > 4) {
        closingMarkets = closingMarkets.slice(0, 4)
      }
      return (
        <div className="dashboardWidget col-md-6">
          <div className="dashboardWidget__market-title">Soon-Closing Markets</div>
          <div
            className={cn({
              dashboardWidget__container: true,
              'no-markets': !closingMarkets.length,
            })}
          >
            {closingMarkets.length ? this.renderClosingMarkets(closingMarkets) : "There aren't closing markets"}
          </div>
        </div>
      )
    }

    if (marketType === 'myHoldings') {
      return (
        <div className="dashboardWidget dashboardWidget--onDark col-md-6">
          <div className="dashboardWidget__market-title">My Tokens</div>
          <div className="dashboardWidget__container">
            {accountShares.length ? this.renderMyHoldings(accountShares, markets) : "You aren't holding any share."}
          </div>
        </div>
      )
    }

    if (marketType === 'myTrades') {
      return (
        <div className="dashboardWidget dashboardWidget--onDark col-md-6">
          <div className="dashboardWidget__market-title">My Trades</div>
          <div className="dashboardWidget__container">
            {accountTrades.length ? this.renderMyTrades(accountTrades, markets) : "You haven't done any trade."}
          </div>
        </div>
      )
    }
  }

  render() {
    const { accountPredictiveAssets, etherTokens, defaultAccount } = this.props
    let metricsSection = <div />
    let tradesHoldingsSection = <div className="dashboardWidgets dashboardWidgets--financial" />
    if (defaultAccount) {
      metricsSection = (
        <div className="dashboardPage__stats">
          <div className="container">
            <div className="row dashboardStats">
              <div className="col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--etherTokens" />
                <span className="dashboardStats__value">
                  <DecimalValue value={etherTokens} />
                </span>
                <div className="dashboardStats__label">Ether Tokens</div>
              </div>
              <div className="col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--incomeForecast" />
                <span className="dashboardStats__value" style={{ color: 'green' }}>
                  <DecimalValue value={accountPredictiveAssets} />
                  &nbsp;ETH
                </span>
                <div className="dashboardStats__label">Outstanding predictions</div>
              </div>
            </div>
          </div>
        </div>
      )

      tradesHoldingsSection = (
        <div className="dashboardWidgets dashboardWidgets--financial">
          <div className="container">
            <div className="row">
              {this.renderWidget('myHoldings')}
              {this.renderWidget('myTrades')}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="dashboardPage">
        <div className="dashboardPage__header">
          <div className="container">
            <div className="row">
              <div className="col-xs-10 col-xs-offset-1 col-sm-12 col-sm-offset-0">
                <h1>Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
        {metricsSection}
        {this.renderControls()}
        <div className="expandable">{this.renderExpandableContent()}</div>
        <div className="dashboardWidgets dashboardWidgets--markets">
          <div className="container">
            <div className="row">
              {this.renderWidget('newMarkets')}
              {this.renderWidget('closingMarkets')}
            </div>
          </div>
        </div>
        {tradesHoldingsSection}
      </div>
    )
  }
}

const marketPropType = PropTypes.object

Dashboard.propTypes = {
  //   selectedCategoricalOutcome: PropTypes.string,
  //   selectedBuyInvest: PropTypes.string,
  //   buyShares: PropTypes.func,
  //   market: marketPropType,
  markets: PropTypes.arrayOf(marketPropType),
  defaultAccount: PropTypes.string,
  accountShares: PropTypes.array,
  accountTrades: PropTypes.array,
  accountPredictiveAssets: PropTypes.string,
  etherTokens: PropTypes.string,
  requestMarkets: PropTypes.func,
  requestGasPrice: PropTypes.func,
  requestAccountShares: PropTypes.func,
  requestAccountTrades: PropTypes.func,
  changeUrl: PropTypes.func,
  requestEtherTokens: PropTypes.func,
  gnosisInitialized: PropTypes.bool,
}

export default Dashboard
