import React, { ReactElement } from 'react'

interface LoaderProps {
  reSize?: number;
  hasData: any;
  svgHeight?: number;
  strokeColor?: string;
  strokeWidth?: number;
  message?: string;
  SVGChoice?: 'DutchXLogo' | 'ETHLogo'
  render(): ReactElement<any>;
}

class Loader extends React.Component<LoaderProps> {
  static defaultProps = {
    svgHeight: 50,
    reSize: 1,
    SVGChoice: 'DutchXLogo',
    strokeColor: '#1c5683',
    strokeWidth: 0.55,
  }

  DutchXLogo = () =>
    <div className="spinnerContainer">
      <div className="slowTradeSpinnerWrap">
        <div className="slowTradeSpinner">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {!!(this.props.message) && <p>{this.props.message}</p>}
    </div>

  ETHLogo = () =>
    <div className="mmSVGContainer" style={{ width: `${150 * this.props.reSize}px` }}>
      <div className="slowTradeSpinnerWrap">
        <div className="slowTradeSpinner">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

  render() {
    const { hasData, render, SVGChoice } = this.props

    return hasData ? render() : this[SVGChoice]()
  }
}

export default Loader
