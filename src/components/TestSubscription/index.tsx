import React from 'react'
import VisualComp from './visual'
// @ts-ignore
import { createSubscription } from 'create-subscription'

import startSubscriptions, {
  AccountSub,
  ETHbalanceSub,
  BlockSub,
  NetworkAndTokensSub,
  TokenBalancesSub,
} from 'subscriptions'

const AccountSubscription = createSubscription({
  getCurrentValue(source: any) {
    // Return the current value of the subscription (source),
    // or `undefined` if the value can't be read synchronously (e.g. native Promises).
    return source.getState()
  },
  subscribe(source: any, callback: any) {
    // Subscribe (e.g. add an event listener) to the subscription (source).
    // Call callback(newValue) whenever a subscription changes.
    // Return an unsubscribe method,
    // Or a no-op if unsubscribe is not supported (e.g. native Promises).

    return source.subscribe(callback)
  },
})
const ETHbalanceSubscription = createSubscription({
  getCurrentValue(source: any) {
    return source.getState()
  },
  subscribe(source: any, callback: any) {
    return source.subscribe(callback)
  },
})
const BlockSubscription = createSubscription({
  getCurrentValue(source: any) {
    return source.getState()
  },
  subscribe(source: any, callback: any) {
    return source.subscribe(callback)
  },
})
const NetworkSubscription = createSubscription({
  getCurrentValue(source: any) {
    return source.getState()
  },
  subscribe(source: any, callback: any) {
    return source.subscribe(callback)
  },
})
const TokenBalancesSubscription = createSubscription({
  getCurrentValue(source: any) {
    return source.getState()
  },
  subscribe(source: any, callback: any) {
    return source.subscribe(callback)
  },
})

const PropsDisplay = (value: any) => <VisualComp {...value} />

export const AllSubs = () => (
  <div>
    <p>Account Subscription</p>
    <AccountSubscription source={AccountSub}>
      {PropsDisplay}
    </AccountSubscription>
    <p>Account Balance</p>
    <ETHbalanceSubscription source={ETHbalanceSub}>
      {PropsDisplay}
    </ETHbalanceSubscription>
    <p>Current Network Subscription</p>
    <NetworkSubscription source={NetworkAndTokensSub}>
      {PropsDisplay}
    </NetworkSubscription>
    <p>Token Balances Subscription</p>
    <TokenBalancesSubscription source={TokenBalancesSub}>
      {PropsDisplay}
    </TokenBalancesSubscription>
    <p>Current Block Subscription</p>
    <BlockSubscription source={BlockSub}>
      {PropsDisplay}
    </BlockSubscription>
  </div>
)

startSubscriptions(true)
