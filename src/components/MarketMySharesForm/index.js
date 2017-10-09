import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, propTypes, reset } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount, calcLMSRProfit } from 'api'

import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'

import FormInput from 'components/FormInput'

import { COLOR_SCHEME_DEFAULT, GAS_COST, LOWEST_DISPLAYED_VALUE } from 'utils/constants'
import { getOutcomeName, weiToEth, normalizeScalarPoint } from 'utils/helpers'
import { marketShape } from 'utils/shapes'

import './marketMySharesForm.less'

class MarketMySharesForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      extendedSellId: undefined,
    }
  }

  componentWillMount() {
    const { gasCosts, gasPrice, requestGasCost, requestGasPrice } = this.props

    if (gasCosts.sellShares === undefined) {
      requestGasCost(GAS_COST.SELL_SHARES)
    }
    if (gasPrice === undefined) {
      requestGasPrice()
    }

    if (this.props.params.shareId) {
      this.state = {
        extendedSellId: this.props.params.shareId,
      }
    }
  }

  componentDidUpdate() {
    const { extendedSellId } = this.state
    const {
      selectedSellAmount,
      marketShares,
      initialize,
    } = this.props

    if (selectedSellAmount === undefined && extendedSellId !== undefined) {
      // By default form is filled up with fill amount
      const share = marketShares.filter(_share => _share.id === extendedSellId)[0]
      const fullAmount = Decimal(share.balance).div(1e18).toDP(4, 1).toString()
      initialize({ sellAmount: fullAmount })
    }
  }

  @autobind
  handleShowSellView(e, shareId) {
    const { initialize } = this.props
    e.preventDefault()
    this.props.reset()
    // Form reset / reinitialization when switching among shares
    initialize({})
    this.setState({ extendedSellId: (shareId === this.state.extendedSellId ? undefined : shareId) })
  }

  @autobind
  handleCloseSellView(e) {
    e.preventDefault()
    this.props.reset()
    this.setState({ extendedSellId: undefined })
  }

  @autobind
  handleSellShare(shareId, shareAmount) {
    const shareIndex = this.props.marketShares.map(share => share.id).indexOf(shareId)
    return this.props.sellShares(this.props.market, shareIndex, shareAmount)
      .then(() => this.props.reset())
  }

  @autobind
  validateTokenCount(val, values, props) {
    let decimalValue
    try {
      decimalValue = Decimal(val || 0)
    } catch (e) {
      return 'Invalid Number value'
    }

    if (decimalValue.lt(0)) {
      return 'Number can\'t be negative.'
    }

    if (decimalValue.gt(Decimal(props.marketShares.filter(
      share => share.id === this.state.extendedSellId)[0].balance,
    ).div(1e18).toString())) {
      return 'You\'re trying to sell more than you invested.'
    }

    return undefined
  }

  renderSellShareView() {
    const { extendedSellId } = this.state
    const {
      market,
      invalid,
      submitting,
      submitFailed,
      selectedSellAmount,
      handleSubmit,
      marketShares,
      gasCosts,
      gasPrice,
    } = this.props

    const share = marketShares.filter(_share => _share.id === extendedSellId)[0]
    let newScalarPredictedValue // calculated only for scalar events
    let selectedSellAmountWei
    try {
      selectedSellAmountWei = new Decimal(parseFloat(selectedSellAmount) || 0).mul(1e18).toString()
    } catch (e) {
      selectedSellAmountWei = '0'
    }
    let currentProbability
    if (market.event.type === 'CATEGORICAL') {
      try {
        currentProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
          funding: market.funding,
          outcomeTokenIndex: share.outcomeToken.index,
        })
      } catch (e) {
        currentProbability = new Decimal(0)
      }
    } else {
      // Scalar
      try {
        currentProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
          funding: market.funding,
          outcomeTokenIndex: 1,
        })
      } catch (e) {
        currentProbability = new Decimal(0)
      }
    }

    const currentTokenCount = share && share.balance ? new Decimal(share.balance) : new Decimal(0)
    const newTokenCount = currentTokenCount.sub(new Decimal(selectedSellAmount || 0).mul(1e18))
    let earnings = new Decimal(0)
    if (share.balance && selectedSellAmount) {
      earnings = weiToEth(calcLMSRProfit({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        outcomeTokenCount: selectedSellAmountWei,
        feeFactor: market.fee,
      }))
    }

    const newNetOutcomeTokensSold = market.netOutcomeTokensSold.map((outcomeTokenAmount, outcomeTokenIndex) => {
      if (outcomeTokenIndex === share.outcomeToken.index && !currentTokenCount.sub(newTokenCount.toString()).isZero()) {
        return Decimal(outcomeTokenAmount).sub(currentTokenCount.sub(newTokenCount.toString()).toString()).floor().toString()
      }

      return Decimal(outcomeTokenAmount).toString()
    })

    let newProbability
    if (market.event.type === 'SCALAR') {
      try {
        newProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: newNetOutcomeTokensSold,
          funding: market.funding,
          outcomeTokenIndex: 1, // long
        })
      } catch (e) {
        newProbability = currentProbability
      }
      const newMarginalPrices = [new Decimal(1).sub(newProbability), newProbability]
      newScalarPredictedValue = normalizeScalarPoint(
        newMarginalPrices,
        market,
      )
    } else {
      // Categorical events
      try {
        newProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: newNetOutcomeTokensSold,
          funding: market.funding,
          outcomeTokenIndex: share.outcomeToken.index,
        })
      } catch (e) {
        newProbability = currentProbability
      }
    }

    if (market.event.type === 'SCALAR') {
      newScalarPredictedValue = normalizeScalarPoint(market.marginalPrices, market)
    }

    const submitDisabled = invalid || submitting
    const gasCostEstimation = weiToEth(gasPrice.mul(gasCosts.sellShares))

    return (
      <div className="marketMyShares__sellContainer">
        <form onSubmit={handleSubmit(() => this.handleSellShare(extendedSellId, selectedSellAmount))}>
          <div className="row marketMyShares__sellRow">
            <div className="col-md-3 col-md-offset-3 marketMyShares__sellColumn">
              <label>Amount to Sell</label>
              <Field
                component={FormInput}
                name="sellAmount"
                placeholder="Enter Token Amount"
                className="marketMySharesSellAmount"
                validate={this.validateTokenCount}
              />
            </div>
            { market.event.type === 'SCALAR' ?
              <div className="col-md-3 marketMyShares__sellColumn">
                <label>New predicted value</label>
                <span>
                  <DecimalValue value={newScalarPredictedValue} />&nbsp;
                  <CurrencyName collateralToken={market.event.collateralToken} />
                </span>
              </div> :
              <div className="col-md-3 marketMyShares__sellColumn">
                <label>New Probability</label>
                <span>
                  <DecimalValue value={newProbability.mul(100)} /> %
                </span>
              </div>
            }
            <div className="col-md-3">
              <label>Earnings</label>
              <span>
                <DecimalValue value={earnings} />&nbsp;
                <CurrencyName collateralToken={market.event.collateralToken} />
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-md-offset-3">
              <label>Gas costs</label>
              <span>
                <DecimalValue value={gasCostEstimation} />&nbsp;
                <CurrencyName collateralToken={market.event.collateralToken} />
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-6 marketMyShares__sellColumn">
              <button className={`btn btn-primary ${submitDisabled ? 'disabled' : ''}`} disabled={submitDisabled}>{submitting ? 'Loading' : 'Sell Shares'}</button>
              <button type="button" className="btn btn-link" onClick={this.handleCloseSellView}>Cancel</button>
            </div>
          </div>
          {submitFailed && (
          <div className="row">
            <div className="col-md-9 col-md-offset-3 marketMyShares__errorColumn">
              Sorry - your share sell could not be processed. Please ensure you&quot;re on the right network.
            </div>
          </div>)}
        </form>
      </div>
    )
  }

  generateTableRows() {
    const tableRows = []

    const { marketShares, market } = this.props
    const { extendedSellId } = this.state

    const resolved = market.oracle.isOutcomeSet || market.event.isWinningOutcomeSet

    marketShares.forEach((share, shareIndex) => {
      const probability = calcLMSRMarginalPrice({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
      })
      const maximumWin = calcLMSROutcomeTokenCount({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        cost: share.balance,
      })

      tableRows.push((
        <tr className="marketMyShares__share" key={share.id}>
          <td>
            <div
              className={'shareOutcome__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[share.outcomeToken.index] }}
            />
          </td>
          <td className="">
            {getOutcomeName(market, share.outcomeToken.index)}
          </td>
          <td>
            {Decimal(share.balance).div(1e18).gte(LOWEST_DISPLAYED_VALUE) ?
              <DecimalValue value={Decimal(share.balance).div(1e18)} /> : `< ${LOWEST_DISPLAYED_VALUE}`}
          </td>
          <td>
            <DecimalValue value={maximumWin.mul(probability).div(1e18)} />&nbsp;
            <CurrencyName collateralToken={market.event.collateralToken} />
          </td>
          <td>
            {/* eslint-disable no-script-url */}
            {!resolved && <a href="javascript:void(0);" className="marketMyShares__sellButton" onClick={e => this.handleShowSellView(e, share.id)}>Sell</a>}
            {/* eslint-enable no-script-url */}
          </td>
        </tr>
      ))

      if (share.id === extendedSellId) {
        tableRows.push((
          <tr className="marketMyShares__sellView" key={`${share.id}__sell`}>
            <td colSpan={5}>
              {this.renderSellShareView()}
            </td>
          </tr>
        ))
      }
    })

    return tableRows
  }

  render() {
    const { marketShares } = this.props
    if (!marketShares || !marketShares.length) {
      return (
        <div className="marketMyShares">
          <h2 className="marketMyShares__heading">
            You don&apos;t hold any shares for this market.
            <br />
            <small>It may take some time for the blockchain to mine your share purchase.</small>
          </h2>
        </div>
      )
    }

    return (
      <div className="marketMyShares">
        <h2 className="marketMyShares__heading">My Shares</h2>
        <table className="table marketMyShares__shareTable">
          <thead>
            <tr>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Outcome</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Token Count</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Current Value</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group" />
            </tr>
          </thead>
          <tbody>
            {this.generateTableRows()}
          </tbody>
        </table>
      </div>
    )
  }
}

MarketMySharesForm.propTypes = {
  ...propTypes,
  market: marketShape,
  selectedSellAmount: PropTypes.string,
  marketShares: PropTypes.arrayOf(PropTypes.object),
  sellShares: PropTypes.func,
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(MarketMySharesForm)
