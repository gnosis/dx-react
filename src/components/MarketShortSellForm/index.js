import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSRProfit } from 'api'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'


import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'

import FormRadioButton from 'components/FormRadioButton'
import Input from 'components/FormInput'
import Checkbox from 'components/FormCheckbox'

import './marketShortSellForm.less'
import '../MarketBuySharesForm/marketBuySharesForm.less'

class MarketShortSellForm extends Component {

  getMaximumReturn(collateralTokenCount, profit) {
    if (!isNaN(parseFloat(collateralTokenCount)) && !isNaN(profit)
        && new Decimal(collateralTokenCount).gt(0) && new Decimal(profit).gte(0)) {
      collateralTokenCount = new Decimal(collateralTokenCount).mul(1e18)
      return collateralTokenCount.div(collateralTokenCount.sub(profit))
    }
    return new Decimal(0)
  }

  getMinProfit(market, outcomeTokenIndex, collateralTokenCount) {
    // Ratio outcomeTokenCount : collateralTokenCount is always 1:1
    if (outcomeTokenIndex !== undefined && collateralTokenCount !== undefined
        && new Decimal(outcomeTokenIndex).gte(0) && new Decimal(collateralTokenCount).gt(0)) {
      const args = {
        outcomeTokenIndex,
        netOutcomeTokensSold: market.netOutcomeTokensSold,
        funding: market.funding,
        outcomeTokenCount: new Decimal(collateralTokenCount).mul(1e18),
        feeFactor: market.fee,
      }

      // Calculate minimum profit
      const minProfit = calcLMSRProfit(args)
      return minProfit
    }

    return new Decimal(0)
  }

  @autobind
  handleShortSell() {
    // TODO
    event.preventDefault
    const { market: { eventDescription } } = this.props
    const outcomeIndex = event.target.value
    const outcome = eventDescription.outcomes[outcomeIndex]
  }

  renderOutcomes() {
    const { market: { event } } = this.props

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderCategorical()
    }

    return (
      <div className="col-md-4">
        <span>Invalid Outcomes...</span>
      </div>
    )
  }

  renderReturnedOutcomeTokens() {
    const { selectedShortSellOutcome, market: { eventDescription }, selectedShortSellAmount } = this.props

    let renderedOutcomes = []
    if (!isNaN(parseFloat(selectedShortSellOutcome))) {
      // if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      renderedOutcomes = eventDescription.outcomes
      .filter((outcome, index) => index !== parseFloat(selectedShortSellOutcome))
    }
    // Remove the current selected outcome from color_scheme, this allows us to
    // show the right colors for the unselected outcomes
    const colorScheme = Object.assign([], COLOR_SCHEME_DEFAULT)
    colorScheme.splice(selectedShortSellOutcome, 1)

    return renderedOutcomes.map(
      (outcome, index) =>
        (
          <div key={index} className="row">
            <div
              className={'entry__color col-md-4'} style={{ backgroundColor: colorScheme[index] }}
            />
            <div className="col-md-8">
              {outcome}
            </div>
            {selectedShortSellAmount} Tokens
          </div>
        ),
    )
  }

  renderCategorical() {
    const { market: { eventDescription }, selectedShortSellOutcome } = this.props
    return (
      <div className="col-md-4">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">SELECT  OUTCOME</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {eventDescription.outcomes.map((label, index) => (
              <Field
                key={index}
                component={FormRadioButton}
                name="selectedOutcome"
                highlightColor={COLOR_SCHEME_DEFAULT[index]}
                className={index === parseInt(selectedShortSellOutcome, 10) ? 'marketBuyOutcome selected-outcome' : 'marketBuyOutcome'}
                radioValue={index}
                text={label}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      handleSubmit,
      selectedShortSellAmount,
      selectedShortSellOutcome,
      market: {
        event: {
          type: eventType,
          collateralToken,
        },
        ...market
      },
    } = this.props

    const minProfit = this.getMinProfit(market, selectedShortSellOutcome, selectedShortSellAmount)
    const maximumReturn = this.getMaximumReturn(selectedShortSellAmount, minProfit)

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleShortSell)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">YOUR BET</h2>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-8">
                  <Field
                    name="shortSellAmount" component={Input} className="marketSellAmount"
                    placeholder="Enter amount"
                  />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    <CurrencyName collateralToken={collateralToken} />
                  </div>
                </div>
              </div>
              {this.renderReturnedOutcomeTokens()}
              <div className="row marketShortSellForm__row">
                <div className="col-md-6">
                    Maximum return
                  </div>
                <div className="col-md-6">
                  <span className="marketBuyWin__row marketBuyWin__max">
                    <DecimalValue value={maximumReturn} /> %
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">CHECKOUT</h2>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-12">
                  <Field
                    name="confirm" component={Checkbox} className="marketBuyCheckbox"
                    text="I AGREE AND UNDERSTAND THAT ETH WILL BE TRANSFERRED FROM MY ACCOUNT"
                  />
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-6">
                  <button className="btn btn-primary">PLACE ORDER</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-default col-md-12 marketShortSell__cancel">DISCARD</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

}

MarketShortSellForm.propTypes = {
  market: PropTypes.shape({
    address: PropTypes.string,
  }),
  selectedShortSellAmount: PropTypes.string,
  selectedShortSellOutcome: PropTypes.string,
}

const FORM = {
  form: 'marketShortSell',
}

export default reduxForm(FORM)(MarketShortSellForm)
