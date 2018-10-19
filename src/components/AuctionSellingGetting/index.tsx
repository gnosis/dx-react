import React, { Component } from 'react'

import { Balance, BigNumber } from 'types'
import { getTokenPriceInUSD } from 'api'

/* CONSIDER ADDING GAS_COST */
export interface AuctionSellingGettingProps {
  maxSellAmount: BigNumber,
  buyTokenSymbol: string,
  sellTokenSymbol: string,
  sellTokenAddress: string,
  sellAmount: Balance,
  buyAmount: Balance,
  setSellTokenAmount(props: any): any,
}

interface AuctionSellingGettingState {
  sellTokenInUSD: BigNumber,
}

const MAX_SELL_USD = 500

class AuctionSellingGetting extends Component<AuctionSellingGettingProps, AuctionSellingGettingState> {
  componentDidMount() {
    this.tokenInUSD()
  }

  componentDidUpdate(prevProps: AuctionSellingGettingProps) {
    if (prevProps.sellTokenAddress !== this.props.sellTokenAddress) this.tokenInUSD()
  }

  tokenInUSD = async () => {
    if (!this.props.sellTokenAddress) return
    const tokenUSDPrice = await getTokenPriceInUSD(this.props.sellTokenAddress)
    console.log('tokenUSDPrice: ', tokenUSDPrice.toString())
    this.setState({
      sellTokenInUSD: tokenUSDPrice,
    })
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement & HTMLFormElement>) => {
    // TODO: consider using e.target.value.match(/^(0|[1-9]\d*)(\,|.\d+)?(e-?(0|[1-9]\d*))?$/i)
    const input = e.target
    const { sellAmount, setSellTokenAmount, maxSellAmount, sellTokenSymbol } = this.props
    const { sellTokenInUSD } = this.state

    let { value } = input
    // if (value.length < 1) return setSellTokenAmount({ sellAmount: '0' })

    // check for commas and replace as decimals
    value = value.replace(/[,]/g, '.')

    setSellTokenAmount({ sellAmount: value })

    const validValue = !!(+value)
    // validate maxSellAmount isnt exceeded but make sure value is castable to type number
    console.log('validValue && sellAmount: ', validValue, sellAmount)
    if (validValue && value) {
      if (maxSellAmount.lessThanOrEqualTo(value)) {
        input.setCustomValidity(`Amount available for sale is ${maxSellAmount.toString()}`)
        input.reportValidity()
      } else if (sellTokenInUSD && sellTokenInUSD.mul(value).gt(MAX_SELL_USD)) {
        input.setCustomValidity(`You are trading on Mainnet - for the moment, we limit your deposit to an equivalent of ${MAX_SELL_USD}USD (${sellTokenInUSD.mul(value).round(4).toString()}${sellTokenSymbol})`)
        input.reportValidity()
      } else {
        console.log('Reset validity', input.validationMessage)
        input.setCustomValidity('')
        input.reportValidity()
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
