import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'

import DecimalValue from 'components/DecimalValue'

import './scalarSlider.less'

const ScalarSlider = ({
  lowerBound,
  upperBound,
  unit,
  marginalPriceCurrent,
  marginalPriceSelected,
  decimals,
}) => {
  const bigLowerBound = new Decimal(lowerBound)
  const bigUpperBound = new Decimal(upperBound)

  // current value
  const bounds = bigUpperBound.sub(bigLowerBound).div(10 ** decimals)

  const value = new Decimal(marginalPriceCurrent).mul(bounds.toString()).add(bigLowerBound.div(10 ** decimals).toString())
  const percentage = new Decimal(marginalPriceCurrent).mul(100)

  const selectedValue = new Decimal(marginalPriceSelected).mul(bounds.toString()).add(bigLowerBound.div(10 ** decimals).toString())
  const selectedPercentage = new Decimal(marginalPriceSelected).mul(100)
  return (
    <div className="scalarSlider">
      <div className="slider">
        <div className="slider__lowerBound">
          {bigLowerBound.div(10 ** decimals).toFixed(0)} {unit}
          <div className="slider__lowerBoundLabel">Lower Bound</div>
        </div>
        <div className="slider__bar" title="Please enter a value on the right!">
          <div className="slider__handle" style={{ left: `${percentage.toFixed(4)}%` }}>
            <div className="slider__handleText">
              <div className="slider__handleTextLabel">Current Bet</div>
              <DecimalValue value={value} decimals={decimals} /> {unit}
            </div>
          </div>
          <div className="slider__handle slider__handle--below" style={{ left: `${selectedPercentage.toFixed(4)}%` }}>
            <div className="slider__handleText">
              <div className="slider__handleTextLabel">Selected Bet</div>
              <DecimalValue value={selectedValue} decimals={decimals} /> {unit}
            </div>
          </div>
        </div>
        <div className="slider__upperBound">
          {bigUpperBound.div(10 ** decimals).toFixed(0)} {unit}
          <div className="slider__upperBoundLabel">Upper Bound</div>
        </div>
      </div>
    </div>
  )
}

ScalarSlider.propTypes = {
  lowerBound: PropTypes.number,
  upperBound: PropTypes.number,
  unit: PropTypes.string,
  marginalPriceCurrent: PropTypes.number,
  marginalPriceSelected: PropTypes.number,
  decimals: PropTypes.number,
}

export default ScalarSlider
