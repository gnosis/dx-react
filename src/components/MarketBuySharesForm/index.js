import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, propTypes } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSROutcomeTokenCount, calcLMSRMarginalPrice } from 'api'

import { weiToEth } from 'utils/helpers'
import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES, GAS_COST, SCALAR_SHORT_COLOR, SCALAR_LONG_COLOR } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import ScalarSlider from 'components/ScalarSlider'

import FormRadioButton from 'components/FormRadioButton'
import FormBarChartRadioButton from 'components/FormBarChartRadioButton'
import Input from 'components/FormInput'

import './marketBuySharesForm.less'

class MarketBuySharesForm extends Component {

  componentWillMount() {
    const { requestGasCost, requestGasPrice, isGasCostFetched, isGasPriceFetched } = this.props
    if (!isGasCostFetched(GAS_COST.BUY_SHARES)) {
      requestGasCost(GAS_COST.BUY_SHARES)
    }
    if (!isGasPriceFetched) {
      requestGasPrice()
    }
  }

  getOutcomeTokenCount(investment, outcomeIndex) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return new Decimal(0)
    }

    const invest = new Decimal(investment).mul(1e18)
    const {
      market: {
        funding,
        netOutcomeTokensSold,
        fee,
      },
    } = this.props

    let outcomeTokenCount
    try {
      outcomeTokenCount = calcLMSROutcomeTokenCount({
        feeFactor: fee,
        netOutcomeTokensSold,
        funding,
        outcomeTokenIndex: parseInt(outcomeIndex, 10),
        cost: invest.toString(),
      })
    } catch (e) {
      return new Decimal(0)
    }

    return outcomeTokenCount
  }

  getMaximumWin(outcomeTokenCount, investment) {
    return outcomeTokenCount.sub(new Decimal(investment).mul(1e18)).div(1e18)
  }

  getPercentageWin(outcomeTokenCount, investment) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return '0'
    }

    const invest = new Decimal(investment).mul(1e18)
    return outcomeTokenCount.div(invest.toString()).mul(100).sub(100)
  }

  @autobind
  handleBuyShares() {
    const {
      market,
      buyShares,
      selectedBuyInvest,
      reset,
      defaultAccount,
      selectedOutcome,
    } = this.props

    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome)

    return buyShares(market, selectedOutcome, outcomeTokenCount, selectedBuyInvest)
      .then(() => {
        // Fetch new trades
        this.props.fetchMarketTrades(market)
        // Fetch new market participant trades
        this.props.fetchMarketParticipantTrades(market.address, defaultAccount)
        // Fetch new shares
        this.props.fetchMarketShares(defaultAccount)
        return reset()
      })
  }

  renderOutcomes() {
    const { market: { event } } = this.props

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderCategorical()
    }

    if (event.type === OUTCOME_TYPES.SCALAR) {
      return this.renderScalar()
    }

    return (
      <div className="col-md-6">
        <span>Invalid Outcomes...</span>
      </div>
    )
  }

  renderCategorical() {
    const { market, market: { eventDescription } } = this.props

    return (
      <div className="col-md-6">
        <Field
          component={FormBarChartRadioButton}
          name="selectedOutcome"
          className="marketBuyOutcome"
          market={market}
          radioValues={eventDescription.outcomes.map((label, index) => ({
            value: index,
            label: eventDescription.outcomes[index],
            highlightColor: COLOR_SCHEME_DEFAULT[index],
          }))}
        />
      </div>
    )
  }

  renderScalar() {
    const {
      selectedBuyInvest,
      selectedOutcome,
      market: {
        event: {
          lowerBound,
          upperBound,
        },
        eventDescription: {
          decimals,
          unit,
        },
        netOutcomeTokensSold,
        funding,
        marginalPrices,
      },
    } = this.props
    const isOutcomeSelected = selectedOutcome !== undefined
    const currentMarginalPrice = marginalPrices[1]
    // Get the amount of tokens to buy
    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome)
    const newNetOutcomeTokenSold = netOutcomeTokensSold.slice()
    if (isOutcomeSelected) {
      newNetOutcomeTokenSold[selectedOutcome] = new Decimal(newNetOutcomeTokenSold[selectedOutcome]).add(outcomeTokenCount).toString()
    }
    const selectedMarginalPrice = isOutcomeSelected ? calcLMSRMarginalPrice({
      netOutcomeTokensSold: newNetOutcomeTokenSold,
      funding,
      outcomeTokenIndex: 1,
    }) : new Decimal('0')

    const scalarOutcomes = [
      {
        value: 0,
        label: 'Short',
        highlightColor: SCALAR_SHORT_COLOR,
      },
      {
        value: 1,
        label: 'Long',
        highlightColor: SCALAR_LONG_COLOR,
      },
    ]

    return (
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <h2 className="marketBuyHeading">Your Bet</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Field
                  component={FormRadioButton}
                  name="selectedOutcome"
                  className="marketBuyOutcome"
                  radioValues={scalarOutcomes}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <ScalarSlider
                  lowerBound={parseInt(lowerBound, 10)}
                  upperBound={parseInt(upperBound, 10)}
                  unit={unit}
                  decimals={decimals}
                  marginalPriceCurrent={currentMarginalPrice}
                  marginalPriceSelected={selectedMarginalPrice.toNumber()}
                  selectedCost={outcomeTokenCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      handleSubmit,
      selectedBuyInvest,
      submitFailed,
      submitting,
      market: {
        event: {
          collateralToken,
        },
      },
      selectedOutcome,
      gasCosts,
      gasPrice,
    } = this.props

    const noOutcomeSelected = typeof selectedOutcome === 'undefined'
    // Get the amount of tokens to buy
    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome)

    const maximumWin = this.getMaximumWin(outcomeTokenCount, selectedBuyInvest !== undefined ? selectedBuyInvest : 0)
    const percentageWin = this.getPercentageWin(outcomeTokenCount, selectedBuyInvest)
    const gasCostEstimation = weiToEth(gasPrice.mul(gasCosts.buyShares))

    let submitEnabled = false
    let fieldError
    let tokenCountField
    let maxReturnField

    if (noOutcomeSelected) {
      fieldError = <span className="marketBuyWin__invalidParam">Select an outcome</span>
    } else if (Decimal(percentageWin.toString()).isZero()) {
      fieldError = <span className="marketBuyWin__invalidParam">Enter investment</span>
    } else if (Decimal(outcomeTokenCount.toString()).isZero()) {
      fieldError = <span className="marketBuyWin__invalidParam">Invalid investment</span>
    } else {
      tokenCountField = (
        <span className="marketBuyWin__row marketBuyWin__max">
          <DecimalValue value={weiToEth(outcomeTokenCount)} />&nbsp;
          <div
            className={'marketBuyWin__outcomeColor'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[selectedOutcome] }}
          />&nbsp;
        </span>
      )

      maxReturnField = (
        <span className="marketBuyWin__row marketBuyWin__max">
          +<DecimalValue value={percentageWin} /> %&nbsp;
          (<DecimalValue value={maximumWin} />&nbsp;
          <CurrencyName collateralToken={collateralToken} />)
        </span>
      )

      submitEnabled = !Decimal(selectedBuyInvest).isZero()
    }

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-6">
              <div className="row marketBuySharesForm__row">
                <div className="col-md-8">
                  <Field name="invest" component={Input} className="marketBuyInvest" placeholder="Investment" />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    <CurrencyName collateralToken={collateralToken} />
                  </div>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                    Token Count
                </div>
                <div className="col-md-6">{fieldError || tokenCountField}</div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                    Maximum return in %
                  </div>
                <div className="col-md-6">{fieldError || maxReturnField}</div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                    Gas Costs
                  </div>
                <div className="col-md-6">
                  <DecimalValue value={gasCostEstimation} /> <CurrencyName collateralToken={collateralToken} /></div>
              </div>
              {submitFailed && (
                <div className="row marketBuySharesForm__row">
                  <div className="col-md-12">Sorry - your investment couldn't be processed. Please ensure you're on the right network.</div>
                </div>
              )}
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                  <button className={`btn btn-primary col-md-12 ${!submitEnabled ? 'disabled' : ''}`} disabled={!submitEnabled}>{submitting ? 'Loading...' : 'Buy Tokens'}</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-default col-md-12 marketBuySharesForm__cancel">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>)
  }
}

MarketBuySharesForm.propTypes = {
  ...propTypes,
  market: marketShape,
  buyShares: PropTypes.func,
  selectedOutcome: PropTypes.number,
  selectedBuyInvest: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleSubmit: PropTypes.func,
  submitEnabled: PropTypes.bool,
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)
