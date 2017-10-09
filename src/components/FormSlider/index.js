import React from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import './formSlider.less'

const Slider = ({ input, label, min, max, decimals, unit }) => {
  let displayValue = parseFloat(input.value)

  if (Number.isNaN(displayValue)) {
    displayValue = 0
  }

  return (
    <div className="formSlider">
      <label htmlFor={input.name} className="formSlider__label">{ label }</label>
      <label className="formSlider__range--min">{min.toFixed(0)}</label>
      <input className="formSlider__input fluid" type="range" min={min} max={max} {...input} step="0.01" />
      <label className="formSlider__range--max">{max.toFixed(0)}</label>
      <label className="formSlider__value">{(displayValue).toFixed(decimals || 2)} {unit}</label>
    </div>
  )
}

Slider.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  decimals: PropTypes.number,
  unit: PropTypes.string,
}

export default Slider
