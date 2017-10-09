import React, { Component } from 'react'
import Decimal from 'decimal.js'
import moment from 'moment'
import { decimalToText, DecimalValue } from 'components/DecimalValue'
import CurrencyName, { collateralTokenToText } from 'components/CurrencyName'
import { COLOR_SCHEME_DEFAULT, RESOLUTION_TIME } from 'utils/constants'
import { getOutcomeName } from 'utils/helpers'

import './marketMyTrades.less'

class MarketMyTrades extends Component {
  componentWillMount() {
    const { market, defaultAccount } = this.props
    if (!market.participantTrades || market.participantTrades.length == 0) {
      // Retrieve participant trades to state
      this.props.fetchMarketParticipantTrades(market.address, defaultAccount)
    }
  }

  getAverageCost(order) {
    if (order.orderType === 'BUY') {
      return new Decimal(order.cost).div(order.outcomeTokenCount).toString()
    } else if (order.orderType === 'SELL') {
      return new Decimal(order.profit).div(order.outcomeTokenCount).toString()
    } else if (order.orderType === 'SHORT SELL') {
      return new Decimal(order.cost).div(order.outcomeTokenCount).toString()
    } else {
      return undefined
    }
  }
  renderTrades() {
    const { market } = this.props

    const tableRowElements = market.participantTrades.map(trade => (
      <tr className="marketMyTrades__share" key={trade._id}>
        <td>
          <div
            className={'shareOutcome__color'}
            style={{ backgroundColor: COLOR_SCHEME_DEFAULT[trade.outcomeToken.index] }}
          />
        </td>
        <td>{trade.orderType}</td>
        <td>{getOutcomeName(market, trade.outcomeToken.index)}</td>
        <td>{decimalToText(new Decimal(trade.outcomeTokenCount).div(1e18), 4)}</td>
        <td>
          {decimalToText(this.getAverageCost(trade))}
          <CurrencyName collateralToken={market.event.collateralToken} />
        </td>
        <td>
          {moment
            .utc(trade.date)
            .local()
            .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
        </td>
      </tr>
    ))

    return tableRowElements
  }

  render() {
    const { marketShares, market } = this.props
    if (market.participantTrades && market.participantTrades.length > 0) {
      return (
        <div className="marketMyTrades">
          <h2 className="marketMyTrades__heading">My Trades</h2>
          <table className="table marketMyTrades__shareTable">
            <thead>
              <tr>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--index" />
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Order Type</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Outcome</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">
                  Outcome token count
                </th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Avg. Price</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Date</th>
              </tr>
            </thead>
            <tbody>{this.renderTrades()}</tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className="marketMyTrades">
          <h2 className="marketMyTrades__heading">You haven&apos;t interacted with this market yet.</h2>
          <h3>Every transaction that happens on this market will be shown here.</h3>
        </div>
      )
    }
  }
}

export default MarketMyTrades
