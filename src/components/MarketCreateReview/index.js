import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import moment from 'moment'
import autobind from 'autobind-decorator'

import { OUTCOME_TYPES, RESOLUTION_TIME, COLOR_SCHEME_DEFAULT } from 'utils/constants'

import CurrencyName from 'components/CurrencyName'
import Checkbox from 'components/FormCheckbox'
import DecimalValue from 'components/DecimalValue'

import './marketCreateReview.less'

class MarketCreateReview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      confirmed: false,
      keepValues: false,
    }
  }

  componentWillMount() {
    this.setState({ keepValues: false })
  }

  componentDidMount() {
    if (!this.props.hasValues) {
      this.props.changeUrl('/markets/new')
    }
  }

  componentWillUnmount() {
    // keepValues will be set before changing to a site where we keep the form
    if (this.props.hasValues && !this.state.keepValues) {
      this.props.reset()
    }
  }

  @autobind
  handleOnChange(e) {
    this.setState({ confirmed: e.target.checked })
  }

  @autobind
  handleCreateMarket() {
    const { formValues, submitForm } = this.props
    submitForm(formValues)
  }

  @autobind
  async handleEdit() {
    await this.setState({ keepValues: true })

    return this.props.changeUrl('/markets/new')
  }

  renderMarketSummary() {
    const { formValues: { resolutionDate, title, description } } = this.props

    return (
      <div className="marketSummary">
        <div className="row">
          <div className="col-md-2">
            <div className="marketReviewHeading marketReviewHeading__checkmark">
              <div className="marketReviewHeading__icon icon icon--checkmark" />
            </div>
          </div>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-12">
                <h2 className="marketReviewHeading marketReviewHeading__title">{title}</h2>
                <p>{description}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">{this.renderOutcomes()}</div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <h3 className="resolutionDate__header">Resolution Date</h3>
                <div className="marketReviewDetails__value">
                  {moment(resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  rendermarketReviewDetails() {
    const { formValues: { collateralToken, fee, funding } } = this.props

    return (
      <div className="marketReviewDetails">
        <div className="row">
          <div className="col-md-12">
            <div className="marketReviewDetails__label">Currency</div>
            <div className="marketReviewDetails__value">
              <CurrencyName collateralToken={collateralToken} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="marketReviewDetails__label">Fee</div>
            <div className="marketReviewDetails__value">
              <DecimalValue value={fee} />%
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="marketReviewDetails__label">Funding</div>
            <div className="marketReviewDetails__value">
              <DecimalValue value={funding} />{' '}
              <CurrencyName collateralToken={collateralToken} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderCheckout() {
    const { createMarketCost, formValues: { funding, collateralToken } } = this.props

    return (
      <div className="checkout">
        <ul className="checkout__list">
          <li className="checkout__listItem">
            <span className="listItem__label">Market Funding</span>
            <div className="listItem__value">
              <DecimalValue value={funding} /> <CurrencyName collateralToken={collateralToken} />
            </div>
          </li>
          <li className="checkout__listItem">
            <span className="listItem__label">Gas Costs</span>
            <span className="listItem__value">
              <DecimalValue value={createMarketCost} /> <CurrencyName collateralToken={collateralToken} />
            </span>
          </li>
          <li className="checkout__seperator" />
          <li className="checkout__listItem checkout__listItem--total">
            <span className="listItem__label">Total</span>
            <span className="listItem__value">
              <DecimalValue value={Decimal(funding || 0).add(Decimal(createMarketCost || 0))} />
            </span>
          </li>
        </ul>
        {/*
        <div className="checkout__payment">
          <Checkbox
            input={{
              name: 'confirm',
              onChange: this.handleOnChange,
            }}
            className="paymentCheckbox"
            text={
              <p className="paymentCheckbox__disclaimer">
              I Hereby confirm, that I understand and agree to the terms and conditions
              and want to proceed with the payment. ETH will be transfered from my account.
            </p>
          }
          />
        </div>
        */}
        <div className="checkout__paymentSubmit">
          <button className="btn btn-primary" type="button" onClick={this.handleCreateMarket}>
            Pay & Create Market
          </button>
        </div>
      </div>
    )
  }

  renderOutcomes() {
    const { formValues: { outcomeType } } = this.props

    if (outcomeType === OUTCOME_TYPES.CATEGORICAL) {
      const { formValues: { outcomes } } = this.props
      return (
        <div className="outcomes__categorical">
          <h3 className="outcomeCategorical__header">Outcome Options</h3>
          {outcomes.map((outcome, index) => (
            <div className="outcomeCategorical" key={index}>
              <div className="outcomeCategorical__color" style={{ backgroundColor: COLOR_SCHEME_DEFAULT[index] }} />
              <div className="outcomeCategorical__label">{outcome}</div>
            </div>
          ))}
        </div>
      )
    }

    if (outcomeType === OUTCOME_TYPES.SCALAR) {
      const { formValues: { unit, upperBound, lowerBound, decimals } } = this.props
      return (
        <div className="outcomes__scalar">
          <h3>Outcome Settings</h3>
          <div className="outcomeScalar__row">
            <label>Scale Unit</label>
            <span>{unit}</span>
          </div>
          <div className="outcomeScalar__row">
            <label>Values between</label>
            <span>
              {Decimal(lowerBound).toFixed(0)} and {Decimal(upperBound).toFixed(0)}
            </span>
          </div>
          <div className="outcomeScalar__row">
            <label>Outcome Precision</label>
            <span>{decimals} decimals of precision</span>
          </div>
        </div>
      )
    }

    return <div>Something went wrong... Please try again</div>
  }

  render() {
    const { submitting } = this.props

    return (
      <div className="marketCreateReviewPage">
        <div className="marketCreateReviewPage__header">
          <div className="container">
            <h1>Review Market</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8">{this.renderMarketSummary()}</div>
            <div className="col-md-4">{this.rendermarketReviewDetails()}</div>
          </div>
        </div>
        <div className="marketCreateCheckout">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="checkout__disclaimer">
                  Please review the entered market details carefully. Once the market is created you will not be able to
                  change any of its details and settings anymore. After you double-checked the details you may approve
                  the market creation.
                </p>
                <button
                  className="btn btn-default btn-default--muted"
                  type="button"
                  onClick={this.handleEdit}
                  disabled={submitting}
                >
                  <i className="arrow arrow--right" /> Edit
                </button>
              </div>
              <div className="col-md-6">
                <h2 className="checkout__header">Checkout</h2>
                {this.renderCheckout()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

MarketCreateReview.propTypes = {
  formValues: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    oracleType: PropTypes.string,
    funding: PropTypes.string,
    collateralToken: PropTypes.string,
    unit: PropTypes.string,
    upperBound: PropTypes.string,
    lowerBound: PropTypes.string,
    decimals: PropTypes.string,
    outcomeType: PropTypes.string,
    outcomes: PropTypes.arrayOf(PropTypes.string),
  }),
  createMarketCost: PropTypes.string,
  hasValues: PropTypes.bool,
  changeUrl: PropTypes.func,
  submitForm: PropTypes.func,
  reset: PropTypes.func,
  submitting: PropTypes.bool,
}

export default MarketCreateReview
