import React from 'react'
import PropTypes from 'prop-types'

// Current mapping does not contain any logic
export const outcomeTokenToText = () => 'Outcome Token'
export const collateralTokenToText = () => 'ETH'

const CurrencyName = ({ collateralToken, outcomeToken }) => {
  if (collateralToken) {
    return <span>{collateralTokenToText(collateralToken)}</span>
  }

  if (outcomeToken) {
    return <span>{outcomeTokenToText(outcomeToken)}</span>
  }

  return <span>Unknown</span>
}

CurrencyName.propTypes = {
  collateralToken: PropTypes.string,
  outcomeToken: PropTypes.string,
}

export default CurrencyName
