import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import FormRadioButton, { FormRadioButtonLabel } from 'components/FormRadioButton'
import FormInput from 'components/FormInput'

import './marketResolveForm.less'

class MarketResolveForm extends Component {
  @autobind
  handleResolve(values) {
    const { market: { event: { type }, eventDescription: { decimals } } } = this.props

    const { selectedOutcome, selectedValue } = values

    if (type === OUTCOME_TYPES.CATEGORICAL) {
      return this.props.resolveMarket(this.props.market, selectedOutcome)
    } else if (type === OUTCOME_TYPES.SCALAR) {
      const outcome = Decimal(selectedValue).times(10 ** decimals)
      return this.props.resolveMarket(this.props.market, outcome.trunc())
    }

    throw new Error(`got unexpected type ${type}`)
  }
  renderResolveScalar() {
    const { handleSubmit } = this.props

    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveScalar">
          <Field name="selectedValue" component={FormInput} label={'Enter outcome'} />
        </div>
        <button type="submit" className="btn btn-primary">
          Resolve Oracle
        </button>
      </form>
    )
  }

  renderResolveCategorical() {
    const { handleSubmit, market: { eventDescription: { outcomes } } } = this.props
    const outcomesFormatted = []
    outcomes.forEach((outcome) => {
      outcomesFormatted.push({ label: outcome, value: outcome })
    })

    return (
      <form className="marketResolve" onSubmit={handleSubmit(this.handleResolve)}>
        <div className="marketResolveCategorical">
          <Field
            className="marketResolveFormRadio"
            name="selectedOutcome"
            component={FormRadioButton}
            radioValues={outcomesFormatted}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Resolve Oracle
        </button>
      </form>
    )
  }

  render() {
    const { submitting, market: { event: { type }, oracle: { isOutcomeSet } } } = this.props

    if (submitting) {
      return <span>Resolving Oracle...</span>
    }

    if (isOutcomeSet) {
      return <span>Oracle already resolved</span>
    }

    if (type === OUTCOME_TYPES.SCALAR) {
      return this.renderResolveScalar()
    } else if (type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderResolveCategorical()
    }

    return <span>Something went wrong. Please reload the page</span>
  }
}

MarketResolveForm.propTypes = {
  market: marketShape,
  submitting: PropTypes.bool,
  resolveMarket: PropTypes.func,
  handleSubmit: PropTypes.func,
}

const FORM = {
  form: 'MarketResolveForm',
}

export default reduxForm(FORM)(MarketResolveForm)
