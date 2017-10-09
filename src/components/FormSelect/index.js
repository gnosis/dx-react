import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import { pick } from 'lodash'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

import { bemifyClassName } from 'utils/helpers'

// onBlur function is needed to make it work with redux-Form
// https://github.com/erikras/redux-form/issues/82

const FormSelect = ({ input, label, values, className, defaultValue, ...props }) => {
  const selectProps = pick(props, [])
  return (
    <div className={`selectField ${bemifyClassName(className)}`}>
      <label htmlFor={input.name} className={`selectField__label ${bemifyClassName(className, 'label')}`}>
        {label}
      </label>
      <Select
        {...input}
        {...selectProps}
        className={`selectField__input ${bemifyClassName(className, 'input')}`}
        value={input.value ? input.value : defaultValue}
        options={values}
        onBlur={() => input.onBlur(input.value.value)}
      />
    </div>
  )
}

const valueType = PropTypes.string

FormSelect.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
  defaultValue: valueType,
}

export default FormSelect
