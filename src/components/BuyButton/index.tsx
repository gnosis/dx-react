import React, { Component } from 'react'
import { connect } from 'react-redux'

import { State } from 'types'

import { getDutchXConnection } from 'api/dutchx'

const waitFor = (timeout = 20000, acct: string) => new Promise((res) => {
  console.log(`Switch to ${acct}. Start delay ${timeout / 1000} sec`)

  setTimeout(() => (console.log('end delay'), res()), timeout)
})

class BuyButton extends Component<any,any> {
  
  state = {
    toBuy: '0',
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({
    toBuy: e.target.value,
  })

  submitBuyOrder = () => {
    const { buy, sell } = this.props
    const { toBuy } = this.state
    
    let dxa: any
    let dxEG: any
    let currAuctionIdx: any
    let amount: any
    const master = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
    const buyer = '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'

    const setAuctionAndPostBuyOrder = async (dx: any) => {
      amount = Number(toBuy)
      dxEG = await dx[`DutchExchange${sell}${buy}`]

      await waitFor(10000, 'Master')
      
      const auctionStart = (await dxEG.auctionStart()).toNumber()
      const now = (await dxEG.now()).toNumber()
      // auction hasn't started yet
      const timeUntilStart = auctionStart - now
      // move time to start + 1 hour
      await dxEG.increaseTimeBy(1, timeUntilStart, { from: master })

      await waitFor(10000, 'Buyer')

      dxa = await dxEG.address
      currAuctionIdx = (await dxEG.auctionIndex()).toNumber()

      await dx[`Token${buy}`].approve(dxa, amount, { from: buyer })
      await dxEG.postBuyOrder(amount, currAuctionIdx, { from: buyer, gas: 4712388 })
      console.log('postBuyOrder of AMOUNT: ', amount)
    }

    return Promise.resolve(getDutchXConnection())
      // Dynamically call the correct Token Pair contract
      .then((dx) => {
        return setAuctionAndPostBuyOrder(dx)
      })
      .catch(e => console.error(e))
  }  
  
  render () {  
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

export default connect(mapState, undefined)(BuyButton)

