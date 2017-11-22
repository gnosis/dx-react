// import { setCurrentAccountAddress } from '../../actions/blockchain'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { State } from 'types'

import { getDutchXConnection, getTokenBalances } from 'api/dutchx'
// import { setCurrentAccountAddress } from 'actions/blockchain'
import { setTokenBalance } from 'actions/tokenBalances'

// const waitFor = (acct: string) => window.alert(`Switch to ${acct}`)

class BuyButton extends Component<any, any> {

  state = {
    toBuy: '0',
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
    toBuy: e.target.value,
  })

  submitBuyOrder = () => {
    const { buy, sell, dispatch } = this.props
    const { toBuy } = this.state

    let dxa: any
    let dxEG: any
    let tokenBuy: any
    let currAuctionIdx: any
    let amount: any
    // const master = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
    const seller = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'

    const setUpPostBuyOrder = async (dx: any) => {
      amount = Number(toBuy)
      dxEG = dx[`DutchExchange${sell}${buy}`]
      tokenBuy = dx[`Token${buy}`]

      // Use `truffle exec trufflescripts/start_auction.js` instead
      // Need to explicitly switch between MASTER and SELLER for buying here...
      // await waitFor('Master')
      // const auctionStart = (await dxEG.auctionStart()).toNumber()
      // const now = (await dxEG.now()).toNumber()
      // // auction hasn't started yet
      // const timeUntilStart = auctionStart - now
      // // move time to start + 1 hour
      // await dxEG.increaseTimeBy(1, timeUntilStart, { from: master })
      // await waitFor('Seller')

      // console.log('AUCTION STARTS IN: ', auctionStart - now)

      dxa = await dxEG.address
      // Get current Auction index + LOG
      currAuctionIdx = (await dxEG.auctionIndex()).toNumber()
      console.log(`Current Auction Index = ${currAuctionIdx}`)
      // Approve DXchange to move of BUY tokens
      await tokenBuy.approve(dxa, amount, { from: seller })
      console.log(`Approved DutchExchange${sell}${buy} to handle up to ${amount} ${buy} Tokens on SELLER's behalf.`)

      setAuctionAndPostBuyOrder(dxEG)
    }

    const setAuctionAndPostBuyOrder = async (dxEG: any) => {
      // Abort if no amount selected
      if (amount <= 0) return false

      try {
        // await dispatch(setCurrentAccountAddress({ currentAccount: seller }))
        // Post the Buy Order and return a receipt
        const postBuyReceipt = await dxEG.postBuyOrder(amount, currAuctionIdx, { from: seller, gas: 4712388 })
        console.log(`postBuyOrder of AMOUNT: ${amount}`, postBuyReceipt)

        // TODO: function to get specific Token's balance, also actions for such functions
        const tokenBalance = await getTokenBalances(seller)

        // Grab each TokenBalance and dispatch
        tokenBalance.forEach(async (token: any) =>
          await dispatch(setTokenBalance({ tokenName: token.name, balance: token.balance })))

        return true
      } catch (e) {
        console.error(e)
      }
    }

    return Promise.resolve(getDutchXConnection())
      // Dynamically call the correct Token Pair contract
      .then((dx) => {
        return setUpPostBuyOrder(dx)
      })
      .catch(e => console.error(e))
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

