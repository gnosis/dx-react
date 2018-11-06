import React from 'react'
import VisualComp from './visual'
// @ts-ignore
import { createSubscription } from 'create-subscription'
import { grabProviderState } from 'integrations/provider'

const Web3 = require('web3')
Web3.providers.HttpProvider.prototype.send = Web3.providers.HttpProvider.prototype.sendAsync
const web3 = new Web3(window.web3.currentProvider)

const fakeProvider = {
  name: 'FAKE PROVIDER',
  keyName: 'FAKE PROVIDER',
  available: true,
  walletAvailable: true,
  web3,
}

let filter: any

const filterObject = {
  currentState: {
    account: web3.eth.accounts[0],
  },
  subscribe(cb: any) {
    let prevAcc = web3.eth.accounts[0]
    // initial state grab
    grabProviderState(fakeProvider as any).then(cb)

    setInterval(async () => {
      if (web3.eth.accounts[0] !== prevAcc) {
        cb({ account: 'changing...' })
        prevAcc = web3.eth.accounts[0]
        const accData = await grabProviderState(fakeProvider as any)
        cb(accData)
      }
    }, 8000)

    // create filter listening for latest new blocks
    filter = web3.eth.filter('latest')
    // watch and update state on new block
    filter.watch(async (err: any, res: any) => {
      console.log('res: ', res)
      if (err) {
        console.log(`Watch error: ${err}`)
        cb({ error: err })
      } else {
        // Update balance
        const accData = await grabProviderState(fakeProvider as any)
        cb(accData)
      }
    })
  },
  unsubscribe() {
    return filter.stopWatching()
  },
}

const Subscription: any = createSubscription({
  getCurrentValue(source: any) {
    // Return the current value of the subscription (source),
    // or `undefined` if the value can't be read synchronously (e.g. native Promises).
    return source.currenState
  },
  subscribe(eventDispatcher: any, callback: any) {
    // Subscribe (e.g. add an event listener) to the subscription (source).
    // Call callback(newValue) whenever a subscription changes.
    // Return an unsubscribe method,
    // Or a no-op if unsubscribe is not supported (e.g. native Promises).

    eventDispatcher.subscribe(callback)

    return () => eventDispatcher.unsubscribe()
  },
})

const ProviderSubscription = () => (
  < Subscription source={filterObject} >
    {(value: any) => <VisualComp {...value} />}
  </Subscription >

)

export default ProviderSubscription
