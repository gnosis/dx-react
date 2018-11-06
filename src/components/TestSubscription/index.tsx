import React from 'react'
// @ts-ignore

import { createSubscription } from 'create-subscription'
import VisualComp from './visual'
import { grabProviderState } from 'integrations/provider'

const Web3 = require('web3')
Web3.providers.HttpProvider.prototype.send = Web3.providers.HttpProvider.prototype.sendAsync
const web3 = new Web3(window.web3.currentProvider);
(window as any).wweebb3 = web3
// const address = web3.eth.defaultAccount
// let balance = web3.eth.getBalance(address)
// console.log('TCL: balance', balance)

// const filter = web3.eth.filter('latest')
// filter.watch((err: any, res: any) => {
//   if (err) {
//     console.log(`Watch error: ${err}`)
//   } else {
//     // Update balance
//     web3.eth.getBalance(address, (err: any, bal: any) => {
//       if (err) {
//         console.log(`getBalance error: ${err}`)
//       } else {
//         balance = bal
//         console.log(`Balance [${address}]: ${web3.fromWei(balance, 'ether')}`)
//       }
//     })
//   }
// })

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
    grabProviderState(fakeProvider as any).then(cb)
    // web3.eth.getBalance(web3.eth.accounts[0], (err: any, balance: any) => {
    //   if (err) {
    //     console.log(`getBalance error: ${err}`)
    //     cb({ error: err })
    //   } else {
    //     console.log(`Balance [${address}]: ${web3.fromWei(balance, 'ether')}`)
    //     cb({ account: web3.eth.accounts[0], balance })
    //   }
    // })

    setInterval(async () => {
      if (web3.eth.accounts[0] !== prevAcc) {
        cb({ account: 'changing...' })
        prevAcc = web3.eth.accounts[0]
        const accData = await grabProviderState(fakeProvider as any)
        cb(accData)
        // web3.eth.getBalance(web3.eth.accounts[0], (err: any, balance: any) => {
        //   if (err) {
        //     console.log(`getBalance error: ${err}`)
        //     cb({ error: err })
        //   } else {
        //     console.log(`Balance [${address}]: ${web3.fromWei(balance, 'ether')}`)
        //     cb({ account: web3.eth.accounts[0], balance })
        //   }
        // })
      }
    }, 8000)
    filter = web3.eth.filter('latest')
    filter.watch(async (err: any, res: any) => {
      console.log('res: ', res)
      if (err) {
        console.log(`Watch error: ${err}`)
        cb({ error: err })
      } else {
        // Update balance
        console.log('web3.eth.defaultAccount: ', web3.eth.accounts[0])
        // web3.eth.accounts[0] && web3.eth.getBalance(web3.eth.accounts[0], (err: any, balance: any) => {
        //   if (err) {
        //     console.log(`getBalance error: ${err}`)
        //     cb({ error: err })
        //   } else {
        //     console.log(`Balance [${address}]: ${web3.fromWei(balance, 'ether')}`)
        //     cb({ account: web3.eth.accounts[0], balance, blockHash: res })
        //   }
        // })

        // web3.eth.getBlock(res, )
        const accData = await grabProviderState(fakeProvider as any)
        cb(accData)
      }
    })
    // console.log('await grabProviderState(fakeProvider as any): ', await grabProviderState(fakeProvider as any));
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

const TestSubscription = () => (
  < Subscription source={filterObject} >
    {(value: any) => <VisualComp {...value} />}
  </Subscription >

)

export default TestSubscription
