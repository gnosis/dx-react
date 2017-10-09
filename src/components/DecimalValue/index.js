import React from 'react'
import PropTypes from 'prop-types'

import Decimal from 'decimal.js'

export const decimalToText = (value, decimals = 2) => {
  if (value && value.toDP) {
    // toDP is a function of Decimal.js, it rounds the Decimal object to decimals places with rounding mode entered
    // rounding mode = 1 => round down
    return value.toDP(decimals, 1).toString()
  }

  let decimalValue
  try {
    decimalValue = Decimal(value)
  } catch (e) {
    console.warn('Invalid prop given to <DecimalValue />: Using 0 as fallback. Please fix this, it causes massive performance issues')
    decimalValue = Decimal(0)
  }

  return decimalValue.toDP(decimals, 1).toString()
}

const DecimalValue = ({ value, decimals = 2, className }) => {
  const text = decimalToText(value, decimals)
  return <span className={className}>{text}</span>
}

// I don't use PropTypes.instanceOf because Decimal can be cloned with different default properties
// and instanceOf doesn't deal with that situation. In fact, Decimal.clone is used in gnosis.js
const decimalJsTest = (props, propName, componentName) => {
  if (!/^(Decimal|(Big)?Number)$/.test(
    props[propName] && props[propName].constructor ? props[propName].constructor.name : null,
  )) {
    return new Error(`Non-numeric \`${propName}\` supplied to \`${componentName}\`. Validation failed.`)
  }
  return undefined
}

DecimalValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, decimalJsTest]),
  decimals: PropTypes.number,
  className: PropTypes.string,
}

export default DecimalValue
