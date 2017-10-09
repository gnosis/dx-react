import React, { PropTypes, Component } from 'react'
import { reduxForm, propTypes } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'

import './marketWithdrawFeesForm.less'

class MarketWithdrawFeesForm extends Component {

  @autobind
  handleWithdrawFees() {
    this.props.withdrawFees(this.props.market)
  }

  render() {
    const { handleSubmit, submitting, market, market: { withdrawnFees, collectedFees } } = this.props
    const remainingFees = new Decimal(collectedFees).sub(new Decimal(withdrawnFees))
    const submitEnabled = remainingFees.gt(0)

    return (
      <div className="marketWithdrawFeesForm">
        <h2>Withdraw fees</h2>
        <div className="row marketWithdrawFeesForm__row">
          <div className="col-md-3">
            <label>Withdrawn fees</label>
            <span>
              <DecimalValue value={weiToEth(withdrawnFees)} />&nbsp;
              <CurrencyName collateralToken={market.event.collateralToken} />
            </span>
          </div>
          <div className="col-md-3">
            <label>Remaining fees</label>
            <span>
              <DecimalValue value={weiToEth(remainingFees)} />&nbsp;
              <CurrencyName collateralToken={market.event.collateralToken} />
            </span>
          </div>
        </div>
        <div className="row marketWithdrawFeesForm__row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit(this.handleWithdrawFees)}>
              <button
                className={`marketWithdrawFeesForm--submit btn btn-primary ${!submitEnabled ? 'disabled' : ''}`}
                disabled={!submitEnabled}
              >
                {submitting ? 'Loading...' : 'Withdraw'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

MarketWithdrawFeesForm.propTypes = {
  ...propTypes,
  handleSubmit: PropTypes.func,
}

const form = {
  form: 'marketWithdrawFees',
}

export default reduxForm(form)(MarketWithdrawFeesForm)
