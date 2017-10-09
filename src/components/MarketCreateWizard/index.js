import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { Field, propTypes } from 'redux-form'

import * as validators from 'utils/validators'
import { ORACLE_TYPES, GAS_COST } from 'utils/constants'

import GroupCentralizedOracle from 'components/GroupCentralizedOracle'
import GroupBlockDifficulty from 'components/GroupBlockDifficulty'

import FormRadioButton from 'components/FormRadioButton'
import FormSlider from 'components/FormSlider'
import FormInput from 'components/FormInput'

import './marketCreateWizard.less'

export default class MarketCreateWizard extends Component {
  componentDidMount() {
    if (!this.props.defaultAccount) {
      this.props.changeUrl('/markets')
    }


    // i commented this out because we dont have such property 'outcomes'
    // maybe we did before, but now this check will always overwrite our outcomes

    // fill outcomes in case of not filled (coming from review)
    // if (!this.props.outcomes) {
    //   this.props.change('outcomes', ['', ''])
    // }

    this.props.requestGasCost(GAS_COST.MARKET_CREATION)
    this.props.requestGasCost(GAS_COST.CENTRALIZED_ORACLE)
    this.props.requestGasCost(GAS_COST.CATEGORICAL_EVENT)
    this.props.requestGasCost(GAS_COST.SCALAR_EVENT)
    this.props.requestGasCost(GAS_COST.FUNDING)
    this.props.requestGasPrice()
  }

  @autobind
  handleShowReview(values) {
    // clear empty outcomes
    if (values.outcomes) {
      this.props.change('outcomes', values.outcomes.filter(s => s && s.length > 0))
    }
    window.scrollTo(0, 0)
    return this.props.changeUrl('/markets/review')
  }

  renderHeading(index, title) {
    return (
      <div className="row">
        <div className="col-md-2">
          <div className="marketWizardHeading marketWizardHeading__number">{index}</div>
        </div>
        <div className="col-md-10">
          <h2 className="marketWizardHeading marketWizardHeading__title">{title}</h2>
        </div>
      </div>
    )
  }

  renderOracleTypes() {
    const oracleValueLabels = {
      [ORACLE_TYPES.CENTRALIZED]: 'Centralized Oracle',
    }

    return (
      <div className="marketOracle">
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <Field
              name="oracleType"
              label="Oracle Type"
              component={FormRadioButton}
              radioValues={Object.keys(oracleValueLabels).map(value => ({
                label: oracleValueLabels[value],
                value,
              }))}
            />
          </div>
        </div>
      </div>
    )
  }

  renderMarketDetails() {
    return (
      <div className="marketDetails">
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <Field name="fee" component={FormSlider} min={0} max={10} label="Fee" unit="%" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-offset-2 col-md-10">
            <Field
              name="funding"
              continuousPlaceholder="ETH"
              component={FormInput}
              type="text"
              validate={validators.all(
                validators.required,
                validators.isNumber({ decimals: 4 }),
                validators.greaterThanZero,
              )}
              label="Funding"
            />
          </div>
        </div>
      </div>
    )
  }

  renderForOracleType() {
    const { selectedOracleType } = this.props
    const oracleSections = {
      [ORACLE_TYPES.CENTRALIZED]: <GroupCentralizedOracle {...this.props} />,
      [ORACLE_TYPES.BLOCK_DIFFICULTY]: <GroupBlockDifficulty />,
    }

    return oracleSections[selectedOracleType]
  }

  renderForm() {
    return (
      <div className="marketCreate__form">
        {this.renderHeading(1, 'Event Details')}
        {this.renderForOracleType()}
        {this.renderHeading(2, 'Market Details')}
        {this.renderMarketDetails()}
      </div>
    )
  }

  render() {
    return (
      <div className="marketCreateWizardPage">
        <div className="marketCreateWizardPage__header">
          <div className="container">
            <h1>Create Market</h1>
          </div>
        </div>
        <form onSubmit={this.props.handleSubmit(this.handleShowReview)}>
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                {this.renderForm()}
                <button className="marketCreateButton btn btn-primary" type="submit">
                  Review <i className="arrow" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

MarketCreateWizard.propTypes = {
  ...propTypes,
  changeUrl: PropTypes.func,
  selectedOracleType: PropTypes.string,
  defaultAccount: PropTypes.string,
}
