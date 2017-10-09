import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'

import FormInput from 'components/FormInput'
import { COLOR_SCHEME_DEFAULT } from 'utils/constants'

import './formOutcomeList.less'

const FormOutcomeList = ({ fields, label, meta: { error, invalid } }) => (
  <div className="formOutcomeList">
    <label htmlFor="outcomes" className="formOutcomeList__label">
      {label}
    </label>
    {fields.map((field, index) => (
      <div key={index} className={'formOutcomeList__entry'}>
        <div className={'entry__color'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[index] }} />
        <Field
          component={FormInput}
          name={`${field}`}
          onChange={(e, val) => {
            if (index === fields.length - 1 && val != null && val.length > 0) {
              fields.push('')
            }
          }}
          className="formOutcomeListInput"
          placeholder="Add another..."
        />
        {fields.length > 2 && (
          <a
            className="entry__delete"
            href=""
            tabIndex="-1"
            onClick={(e) => {
              e.preventDefault()
              fields.remove(index)
            }}
          >
            Delete
          </a>
        )}
      </div>
    ))}
    {invalid && error && <span>{error}</span>}
  </div>
)

FormOutcomeList.propTypes = {
  fields: PropTypes.shape({
    push: PropTypes.func,
    remove: PropTypes.func,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  label: PropTypes.string,
}

export default FormOutcomeList
