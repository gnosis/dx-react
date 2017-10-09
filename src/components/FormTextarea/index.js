import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import TextareaAutosize from 'react-autosize-textarea'

import './textareaField.less'

const Input = ({ input, label, className, meta: { touched, error } }) => (
  <div className="textareaField">
    <label htmlFor={input.name} className={`textareaField__label ${className ? `${className}__label` : ''}`}>{ label }</label>
    <TextareaAutosize
      className={`textareaField__input ${className ? `${className}__input` : ''} ${error && touched ? `textareaField__input--error ${className ? `${className}__input--error` : ''}` : ''}`}
      {...input}
    />
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
  className: PropTypes.string,
}

export default Input
