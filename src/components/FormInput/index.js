import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import { bemifyClassName } from 'utils/helpers'

import './formInput.less'

const Input = ({ input, label, type, className, placeholder, continuousPlaceholder, meta: { touched, error } }) => (
  <div className={`inputField ${bemifyClassName(className)}`}>
    <label htmlFor={input.name} className={`inputField__label ${bemifyClassName(className, 'label')}`}>{ label }</label>
    <input
      className={`inputField__input ${bemifyClassName(className, 'input')} ${error && touched ? `inputField__input--error ${bemifyClassName(className, 'input', 'error')}` : ''}`}
      placeholder={placeholder}
      type={`${type || 'text'}`}
      {...input}
    />
    {continuousPlaceholder &&
      <input
        className={`inputField__continuousPlaceholder ${bemifyClassName(className, 'continuousPlaceholder')}`}
        type="text"
        value={continuousPlaceholder}
        disabled
      />}
    {touched &&
      error &&
      <span>
        {error}
      </span>}
  </div>
)

Input.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
}

export default Input
