import React, { Component } from 'react'

import { Balance, TokenCode } from 'types'

/* CONSIDER ADDING GAS_COST */
export interface AuctionSellingGettingProps {
  balance: Balance,
  buyToken: TokenCode,
  ratio: number,
  sellToken: TokenCode,
}

export interface AuctionSellingGettingState {
  value: string | number
}

class AuctionSellingGetting extends Component<AuctionSellingGettingProps, AuctionSellingGettingState> {

  state = {
    value: 0,
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    })
  }

  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { balance } = this.props

    e.preventDefault()

    this.setState({
      value: Number(balance),
    })
  }

  render() {
    const { sellToken, buyToken, ratio } = this.props
    const { value } = this.state

    return (
      <div className="auctionAmounts">
        <span>
          <label htmlFor="sellingAmount">Amount Selling:<a href="#max" onClick={this.onClick}>MAX</a></label>
          <input 
            type="number" 
            name="sellingAmount" 
            id="sellingAmount" 
            onChange={this.onChange} 
            value={value} 
          />
          <small>{sellToken}</small>
        </span>

        <span>
          <label htmlFor="gettingAmount">Est. Amount Getting:</label>
          {/* CONSIDER ADDING GAS_COST TO RATIO */}
          <input type="number" name="gettingAmount" id="gettingAmount" value={value * ratio} disabled />
          <small>{buyToken}</small>
        </span>
      </div>
    )
  }
}

export default AuctionSellingGetting
