import React, { Component } from 'react'

import { Balance, BigNumber } from 'types'
import { getTokenPriceInUSD } from 'api'
import { MAX_SELL_USD } from 'globals'

/* CONSIDER ADDING GAS_COST */
export interface AuctionSellingGettingProps {
  maxSellAmount: BigNumber,
  buyTokenSymbol: string,
  sellTokenSymbol: string,
  sellTokenAddress?: string,
  sellAmount: Balance,
  buyAmount: Balance,
  onValidityChange?(choice: boolean): void,
  setSellTokenAmount(props: any): any,
  network?: string,
}

interface AuctionSellingGettingState {
  sellTokenInUSD?: BigNumber,
}

class AuctionSellingGetting extends Component<AuctionSellingGettingProps, AuctionSellingGettingState> {
  input: HTMLInputElement = null
  state: AuctionSellingGettingState = {}

  componentDidMount() {
    this.props.network === 'MAIN' && this.tokenInUSD()
  }

  componentDidUpdate(prevProps: AuctionSellingGettingProps) {
    if (prevProps.sellTokenAddress !== this.props.sellTokenAddress) {
      this.props.network === 'MAIN' && this.tokenInUSD()
      this.input.setCustomValidity('')
    }
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
    const { sellAmount, setSellTokenAmount, maxSellAmount, sellTokenSymbol, onValidityChange, network } = this.props
    const { sellTokenInUSD } = this.state

    let { value } = input
    // if (value.length < 1) return setSellTokenAmount({ sellAmount: '0' })

    // check for commas and replace as decimals
    value = value.replace(/[,]/g, '.')

    setSellTokenAmount({ sellAmount: value })

    const validValue = !!(+value)
    // validate maxSellAmount isnt exceeded but make sure value is castable to type number
    console.log('validValue && sellAmount: ', validValue, sellAmount)
    let validityMessage = ''
    if (validValue && value) {
      if (maxSellAmount.lessThanOrEqualTo(value)) {
        validityMessage = `Amount available for sale is ${maxSellAmount.toString()}`
      } else if (MAX_SELL_USD && network === 'MAIN' && sellTokenInUSD && sellTokenInUSD.mul(value).gt(MAX_SELL_USD)) {
        validityMessage = `Amount is limited to an equivalent of ${MAX_SELL_USD}USD (${sellTokenInUSD.toPower(-1).mul(MAX_SELL_USD).toFixed(4).toString()}${sellTokenSymbol})`
      } else {
        validityMessage = ''
      }
    } else {
      validityMessage = 'Please enter a valid number and/or valid separator'
    }

    input.setCustomValidity(validityMessage)
    validityMessage && input.reportValidity()

    onValidityChange && onValidityChange(!validityMessage)
    console.log('onValidityChange: ', !validityMessage)
  }

  onFocus = () => this.props.setSellTokenAmount({ sellAmount: '' })

  /* Removed as per DX-335 - unsafe UX - keeping commented for now
  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { maxSellAmount, setSellTokenAmount } = this.props

    e.preventDefault()

    setSellTokenAmount({ sellAmount: maxSellAmount })
  } */

  render() {
    const { sellTokenSymbol, buyTokenSymbol, buyAmount/* , maxSellAmount */, sellAmount/*, network */ } = this.props

    return (
      <div className="auctionAmounts">
        {/* {MAX_SELL_USD && network === 'MAIN' && <span className="message">
          You are trading on Mainnet - for the moment, we limit your deposit to an equivalent of 500USD
        </span>} */}
        <label htmlFor="sellingAmount">Amount Depositing:</label>
        {/* <a href="#max" onClick={this.onClick}>MAX</a> */}
        <input
          ref={c => this.input = c}
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
        <input type="text" name="gettingAmount" id="gettingAmount" value={buyAmount} readOnly />
        <small>{buyTokenSymbol}</small>
      </div>
    )
  }
}

export default AuctionSellingGetting
