import React, { PropTypes } from 'react'

import './progressSpinner.less'

const ProgressSpinner = ({
  width,
  height,
  progress,
  modifier,
  showLabel,
  label,
  strokeWidthPx = 10,
  fontSizePx = 42,
  showBar = true,
  minBarSize = 0,
}) => {
  const size = Math.min(width, height)
  const r = (size / 2) - strokeWidthPx
  const d = r * 2
  const strokeDashoffset = Math.abs(Math.max(progress, minBarSize / 100) - 1) * Math.PI * d

  return (
    <div
      className={`progressSpinner ${modifier
        ? modifier
            .split(' ')
            .map(mod => `progressSpinner--${mod}`)
            .join(' ')
        : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg className="progressSpinner__svg" width={width} height={width}>
        <defs>
          <linearGradient id="ProgressSpinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00a6c4" />
            <stop offset="46%" stopColor="#05bdc4" />
            <stop offset="100%" stopColor="#0adcc4" />
          </linearGradient>
        </defs>
        <circle
          id="inner"
          r={r}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeDasharray={d * Math.PI}
          strokeDashoffset="0"
          strokeWidth={strokeWidthPx}
        />
        {showBar && (
          <circle
            id="bar"
            r={r}
            cx={size / 2}
            cy={size / 2}
            fill="transparent"
            strokeDasharray={d * Math.PI}
            strokeDashoffset={strokeDashoffset}
            stroke="url(#ProgressSpinnerGradient)"
            strokeWidth={strokeWidthPx}
          />
        )}
      </svg>
      <div className="progressSpinner__label">
        {showLabel && (
          <span className="progressSpinner__labelInner" style={{ fontSize: `${fontSizePx}px` }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

ProgressSpinner.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  progress: PropTypes.number,
  modifier: PropTypes.string,
  showLabel: PropTypes.bool,
  label: PropTypes.any,
  strokeWidthPx: PropTypes.number,
  fontSizePx: PropTypes.number,
  showBar: PropTypes.bool,
  minBarSize: PropTypes.number,
}

export default ProgressSpinner
