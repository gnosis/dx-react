// @ts-ignore
import { createSubscription } from 'create-subscription'
import VisualComp from './visual'

const Web3 = require('web3')
Web3.providers.HttpProvider.prototype.send = Web3.providers.HttpProvider.prototype.sendAsync
const web3 = new Web3(window.web3.currentProvider)
const address = web3.eth.defaultAccount
let balance = web3.eth.getBalance(address)
console.log('TCL: balance', balance)

const filter = web3.eth.filter('latest')
filter.watch((err: any, res: any) => {
  if (err) {
    console.log(`Watch error: ${err}`)
  } else {
    // Update balance
    web3.eth.getBalance(address, (err: any, bal: any) => {
      if (err) {
        console.log(`getBalance error: ${err}`)
      } else {
        balance = bal
        console.log(`Balance [${address}]: ${web3.fromWei(balance, 'ether')}`)
      }
    })
  }
})

const filterObject = {
  currentState: {},
}

const Subscription: any = createSubscription({
    getCurrentValue(source: any) {
    // Return the current value of the subscription (source),
    // or `undefined` if the value can't be read synchronously (e.g. native Promises).
  },
    subscribe(eventDispatcher: any, callback: any) {
    // Subscribe (e.g. add an event listener) to the subscription (source).
    // Call callback(newValue) whenever a subscription changes.
    // Return an unsubscribe method,
    // Or a no-op if unsubscribe is not supported (e.g. native Promises).

  },
  })

< Subscription source = { eventDispatcher } >
  { value => <VisualComp {...value} /> }
</Subscription >
