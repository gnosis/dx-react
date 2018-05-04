import React, { Component } from 'react'

import { Balance } from 'types'

/* CONSIDER ADDING GAS_COST */
export interface AuctionSellingGettingProps {
  maxSellAmount: string,
  buyTokenSymbol: string,
  sellTokenSymbol: string,
  sellAmount: Balance,
  buyAmount: Balance,
  setSellTokenAmount(props: any): any,
}


class AuctionSellingGetting extends Component<AuctionSellingGettingProps> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setSellTokenAmount({ sellAmount: e.target.value })
  }

  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { maxSellAmount, setSellTokenAmount } = this.props

    e.preventDefault()

    setSellTokenAmount({ sellAmount: maxSellAmount })
  }

  render() {
    const { sellTokenSymbol, buyTokenSymbol, buyAmount, maxSellAmount, sellAmount } = this.props

    return (
      <div className="auctionAmounts">
        <label htmlFor="sellingAmount">Amount Selling:</label>
        <a href="#max" onClick={this.onClick}>MAX</a>
        <input
          type="number"
          name="sellingAmount"
          id="sellingAmount"
          onChange={this.onChange}
          value={sellAmount}
          min="0"
          max={maxSellAmount}
        />
        <small>{sellTokenSymbol}</small>

        <label htmlFor="gettingAmount">Est. Amount Getting:</label>
        {/* CONSIDER ADDING GAS_COST TO RATIO */}
        {/* TODO: use BN.mult() */}
        <input type="number" name="gettingAmount" id="gettingAmount" value={buyAmount} readOnly />
        <small>{buyTokenSymbol}</small>
      </div>
    )
  }
}

export default AuctionSellingGetting
