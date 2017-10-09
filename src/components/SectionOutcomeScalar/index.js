import React, { PropTypes } from 'react'

import { Field } from 'redux-form'

import * as validators from 'utils/validators'

import Input from 'components/FormInput'

const OutcomeScalar = ({ unit }) => (
  <div className="outcomeScalar">
    <div className="row">
      <div className="col-md-12">
        <Field name="unit" component={Input} label="Unit" validate={validators.required} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field name="decimals" component={Input} label="Number of significant decimals" type="number" placeholder="2" validate={validators.all(validators.required, validators.isNumber({ realOnly: true }))} />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field
          continuousPlaceholder={unit}
          name="lowerBound" component={Input} label="Lower Bound"
          validate={validators.all(validators.required, validators.isNumber({ decimalsProp: 'decimals' }),
          validators.lowerThanProperty({ formProp: 'LowerBound', validateAgainstProp: 'upperBound' }))}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <Field
          continuousPlaceholder={unit}
          name="upperBound" component={Input} label="Upper Bound"
          validate={validators.all(validators.required, validators.isNumber({ decimalsProp: 'decimals' }),
          validators.greaterThanProperty({ formProp: 'UpperBound', validateAgainstProp: 'lowerBound' }))}
        />
      </div>
    </div>
  </div>
)

OutcomeScalar.propTypes = {
  unit: PropTypes.string,
}

export default OutcomeScalar
