import React, { Component } from 'react'

import { Balance, BigNumber } from 'types'

/* CONSIDER ADDING GAS_COST */
export interface AuctionSellingGettingProps {
  maxSellAmount: BigNumber,
  buyTokenSymbol: string,
  sellTokenSymbol: string,
  sellAmount: Balance,
  buyAmount: Balance,
  setSellTokenAmount(props: any): any,
}

class AuctionSellingGetting extends Component<AuctionSellingGettingProps> {
  onChange = (e: React.ChangeEvent<HTMLInputElement & HTMLFormElement>) => {
    // TODO: consider using e.target.value.match(/^(0|[1-9]\d*)(\,|.\d+)?(e-?(0|[1-9]\d*))?$/i)
    const input = e.target
    const { sellAmount, setSellTokenAmount, maxSellAmount } = this.props

    let { value } = input
    // if (value.length < 1) return setSellTokenAmount({ sellAmount: '0' })

    // check for commas and replace as decimals
    value = value.replace(/[,]/g, '.')

    setSellTokenAmount({ sellAmount: value })

    const validValue = !!(+value)
    // validate maxSellAmount isnt exceeded but make sure value is castable to type number
    if (validValue && sellAmount) {
      if (maxSellAmount.lessThanOrEqualTo(value)) {
        input.setCustomValidity(`Amount available for sale is ${maxSellAmount.toString()}`)
        input.reportValidity()
      } else {
        input.setCustomValidity('')
      }
    } else {
      input.setCustomValidity('Please enter a valid number and/or valid separator')
      input.reportValidity()
    }
  }

  onFocus = () => this.props.setSellTokenAmount({ sellAmount: '' })

  /* Removed as per DX-335 - unsafe UX - keeping commented for now
  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { maxSellAmount, setSellTokenAmount } = this.props

    e.preventDefault()

    setSellTokenAmount({ sellAmount: maxSellAmount })
  } */

  render() {
    const { sellTokenSymbol, buyTokenSymbol, buyAmount/* , maxSellAmount */, sellAmount } = this.props

    return (
      <div className="auctionAmounts">
        <label htmlFor="sellingAmount">Amount Depositing:</label>
        {/* <a href="#max" onClick={this.onClick}>MAX</a> */}
        <input
          type="text"
          name="sellingAmount"
          id="sellingAmount"
          onChange={this.onChange}
          onFocus={this.onFocus}
          value={sellAmount}
          min="0"
          /* max={maxSellAmount.toString()} */
          step="0.0001"
          disabled={!sellTokenSymbol}
        />
        <small>{sellTokenSymbol}</small>

        <label htmlFor="gettingAmount">Est. Amount Receiving:</label>
        <input type="number" name="gettingAmount" id="gettingAmount" value={buyAmount} readOnly />
        <small>{buyTokenSymbol}</small>
      </div>
    )
  }
}

export default AuctionSellingGetting
