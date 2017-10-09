import React from 'react'
import { Field } from 'redux-form'
import moment from 'moment'

import Input from 'components/FormInput'
import Textarea from 'components/FormTextarea'
import DateTimePicker from 'components/FormDateTimePicker'

import * as validators from 'utils/validators'

const SectionDescription = () => (
  <div className="sectionDescription">
    <Field component={Input} name="title" label="Title" type="text" validate={validators.required} />
    <Field component={Textarea} name="description" label="Description" validate={validators.required} />
    <Field component={DateTimePicker} name="resolutionDate" label="Resolution Date" validate={validators.all(validators.required, validators.isDate({ minDate: moment().startOf('day').format() }))} />
  </div>
)

export default SectionDescription
