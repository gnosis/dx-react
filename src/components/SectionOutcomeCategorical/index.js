import React from 'react'

import { FieldArray } from 'redux-form'
import OutcomeList from 'components/FormOutcomeList'
import { multiSelectMinLength } from 'utils/validators'

const OutcomeCategorical = () => (
  <div className="outcomeCategorical">
    <div className="row">
      <div className="col-md-12">
        <FieldArray
          name="outcomes"
          component={OutcomeList}
          label="Outcomes"
          validate={multiSelectMinLength(2, 2)}
        />
      </div>
    </div>
  </div>
)

export default OutcomeCategorical
