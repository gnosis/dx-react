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
    const input = e.target
    const { value } = input
    const { setSellTokenAmount, maxSellAmount } = this.props
    if (e.target.value.length < 1) return setSellTokenAmount({ sellAmount: '0' })
    setSellTokenAmount({ sellAmount: value })

    if (maxSellAmount.lessThanOrEqualTo(value)) {
      input.setCustomValidity(`amount available for sale is ${maxSellAmount.toString()}`)
      input.reportValidity()
    } else {
      input.setCustomValidity('')
    }
  }

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
          type="number"
          name="sellingAmount"
          id="sellingAmount"
          onChange={this.onChange}
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
