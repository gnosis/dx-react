import { connect } from 'react-redux'
import { formValueSelector, reset, isSubmitting, startSubmit, stopSubmit } from 'redux-form'
import { push } from 'react-router-redux'
import moment from 'moment'
import uuid from 'uuid/v4'

import MarketCreateReview from 'components/MarketCreateReview'
import { getGasCosts, getGasPrice } from 'selectors/blockchain'
import { createMarket } from 'actions/market'
import { openModal } from 'actions/modal'
import { ORACLE_TYPES, OUTCOME_TYPES } from 'utils/constants'
import { weiToEth } from 'utils/helpers'

const FORM_NAME = 'marketCreateWizard'

const submitAction = formValues => async (dispatch) => {
  dispatch(startSubmit(FORM_NAME))

  // build models
  const eventDescription = {
    description: formValues.description,
    title: formValues.title,
    resolutionDate: moment(formValues.resolutionDate).format(),
    decimals: formValues.decimals,
    unit: formValues.unit,
    outcomes: formValues.outcomes,
  }

  const oracle = {
    eventDescription: undefined,
    type: formValues.oracleType,
  }

  const event = {
    oracle: undefined,
    collateralToken: undefined,
    type: formValues.outcomeType,
    decimals: formValues.decimals || 0,
    lowerBound: formValues.lowerBound,
    upperBound: formValues.upperBound,
  }

  const market = {
    event: undefined,
    fee: formValues.fee,
    funding: formValues.funding,
  }

  const transactionLogId = uuid()
  await dispatch(openModal({ modalName: 'ModalMarketProgress', transactionId: transactionLogId }))

  let marketContractData
  try {
    marketContractData = await dispatch(createMarket({
      eventDescription,
      oracle,
      event,
      market,
      transactionId: transactionLogId,
    }))
  } catch (e) {
    console.error(e)
  }
  dispatch(stopSubmit(FORM_NAME))
  // redirect to market detail
  dispatch(push(`markets/${marketContractData.address}`))
}

const mapStateToProps = (state) => {
  const selector = formValueSelector(FORM_NAME)
  const hasValues = typeof (selector(state, 'outcomeType')) !== 'undefined'

  if (hasValues) {
    const submitting = isSubmitting(FORM_NAME)(state)
    const oracleType = selector(state, 'oracleType')
    const outcomeType = selector(state, 'outcomeType')
    const gasCosts = getGasCosts(state)
    const gasPrice = getGasPrice(state)
    let createMarketGas = 0
    let createMarketCost = '0'

    if (oracleType === ORACLE_TYPES.CENTRALIZED) {
      createMarketGas += gasCosts.centralizedOracle
    }
    if (outcomeType === OUTCOME_TYPES.CATEGORICAL) {
      createMarketGas += gasCosts.categoricalEvent
    } else if (outcomeType === OUTCOME_TYPES.SCALAR) {
      createMarketGas += gasCosts.scalarEvent
    }

    createMarketGas += gasCosts.funding
    createMarketGas += gasCosts.market
    createMarketCost = weiToEth(gasPrice.mul(Math.floor(createMarketGas)))
    return {
      formValues: {
        oracleType,
        collateralToken: selector(state, 'collateralToken'),
        fee: selector(state, 'fee'),
        funding: selector(state, 'funding'),
        title: selector(state, 'title'),
        description: selector(state, 'description'),
        resolutionDate: selector(state, 'resolutionDate'),
        ultimateOracle: selector(state, 'ultimateOracle'),
        outcomeType,
        outcomes: selector(state, 'outcomes'),
        upperBound: selector(state, 'upperBound'),
        lowerBound: selector(state, 'lowerBound'),
        decimals: selector(state, 'decimals'),
        unit: selector(state, 'unit'),
      },
      createMarketCost,
      hasValues,
      submitting,
    }
  }

  return {
    formValues: {},
    createMarketCost: '0',
    hasValues,
  }
}

const mapDispatchToProps = dispatch => ({
  changeUrl: url => dispatch(push(url)),
  submitForm: formvalues => dispatch(submitAction(formvalues)),
  reset: () => dispatch(reset(FORM_NAME)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketCreateReview)
