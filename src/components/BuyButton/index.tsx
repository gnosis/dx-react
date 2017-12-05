// import { setCurrentAccountAddress } from '../../actions/blockchain'
import React, { Component } from 'react'
import { connect, Dispatch } from 'react-redux'

import { State, Account, TokenCode, Balance } from 'types'

import { getTokenBalances, getCurrentAccount } from 'api/'
import { promisedDutchX } from 'api/DutchX'
import { promisedTokens } from 'api/Tokens'
import { setTokenBalance } from 'actions/tokenBalances'

// const waitFor = (acct: string) => window.alert(`Switch to ${acct}`)

interface BuyButtonProps {
  account: Account,
  buy: TokenCode,
  sell: TokenCode,
  dispatch: Dispatch<any>,
}

interface BuyButtonState {
  toBuy: Balance,
}

class BuyButton extends Component<BuyButtonProps, BuyButtonState> {

  state = {
    toBuy: '0',
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
    toBuy: e.target.value,
  })

  submitBuyOrder = () => {
    const { dispatch, ...pair } = this.props
    const { toBuy } = this.state

    const setUpPostBuyOrder = async () => {
      const amount = Number(toBuy)
      const dxEG = await promisedDutchX
      const Tokens = await promisedTokens

      // Abort if no amount selected
      if (amount <= 0) return false

      try {
        const seller = await getCurrentAccount()
        await Tokens.approve(pair.buy, dxEG.getAddress(pair), amount, { from: seller })
        // Post the Buy Order and return a receipt
        const postBuyReceipt = await dxEG.postBuyOrder(pair, amount, 1, seller)
        console.log(`postBuyOrder of AMOUNT: ${amount}`, postBuyReceipt)

        // TODO: function to get specific Token's balance, also actions for such functions
        const tokenBalance = await getTokenBalances(['ETH', 'GNO'])

        // Grab each TokenBalance and dispatch
        tokenBalance.forEach(async (token: any) =>
          await dispatch(setTokenBalance({ tokenName: token.name, balance: token.balance.toString() })))

        return true
      } catch (e) {
        console.error(e)
      }
    }

    setUpPostBuyOrder()
  }

  render() {
    console.log(this.state.toBuy)
    return (
      <div>
        <input
          type="number"
          name="postBuyOrder"
          onChange={this.handleChange}
          value={this.state.toBuy}
        />
        <button type="submit" onClick={this.submitBuyOrder}>Simulate Buying</button>
      </div>
    )
  }
}

const mapState = (state: State) => ({
  account: state.blockchain.currentAccount,
  buy: state.tokenPair.buy,
  sell: state.tokenPair.sell,
})

export default connect(mapState)(BuyButton)

