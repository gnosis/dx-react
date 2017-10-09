import React from 'react'
import { Field } from 'redux-form'

import { OUTCOME_TYPES } from 'utils/constants'
import * as validators from 'utils/validators'

import FormRadioButton from 'components/FormRadioButton'

const SectionOutcomeSelection = () => {
  const outcomeTypeLabels = {
    [OUTCOME_TYPES.CATEGORICAL]: 'Categorical Outcome',
    [OUTCOME_TYPES.SCALAR]: 'Scalar Outcome',
  }

  return (
    <div className="sectionOutcomeSelection">
      <Field
        name="outcomeType"
        label="Outcome Type"
        component={FormRadioButton}
        radioValues={Object.keys(outcomeTypeLabels).map(value => ({ value, label: outcomeTypeLabels[value] }))}
        validate={validators.required}
      />
    </div>
  )
}

export default SectionOutcomeSelection
