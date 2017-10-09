import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import { bemifyClassName } from 'utils/helpers'

import './formRadioButton.less'

const FormRadioButton = ({ input, radioValues, label, className, meta: { error, touched } }) => (
  <div className={`formRadioButton ${touched && error ? 'formRadioButton--error' : ''}`}>
    {label && <label>{label}</label>}
    {radioValues.map(({ label: radioLabel, value, highlightColor }) => (
      <div key={value} className={`radioButton ${bemifyClassName(className)}`}>
        <input
          type="radio"
          className={`radioButton__input ${bemifyClassName(className, 'input')}`}
          id={`radioButton_${input.name}_${value}`}
          style={highlightColor ? { color: highlightColor } : {}}
          onChange={() => input.onChange(value)}
          checked={input && input.value.toString() === value.toString()}
          value={value}
        />
        <label className={`radioButton__text ${bemifyClassName(className, 'text')}`} htmlFor={`radioButton_${input.name}_${value}`}>
          {radioLabel}
        </label>
      </div>
    ))}
    {touched && error &&
      <span>
        {error}
      </span>}
  </div>
)

FormRadioButton.propTypes = {
  ...fieldPropTypes,
  radioValues: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  className: PropTypes.string,
  highlightColor: PropTypes.string,
}

export default FormRadioButton
