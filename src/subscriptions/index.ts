import createStatefulSub, { createMultiSub } from './genericSub'

import { promisedWeb3 } from 'api/web3Provider'

import { fetchAccountData, fetchETHBalance, fetchBlock, getTokenListAndNetwork, fetchTokenBalances } from './actions'
import { SUBSCRIPTION_INTERVAL } from 'globals'

import { debounce } from 'lodash'

// instantiate early to avoid some race conditions
// TODO: make do without this ugliness
promisedWeb3(window.web3.currentProvider)

export const AccountSub = createStatefulSub(fetchAccountData, { account: 'loading...' })
export const ETHbalanceSub = createStatefulSub(fetchETHBalance, undefined, {
  _shouldUpdate(prevState, nextState) {
    if (!prevState.balance || !prevState.account) return true
    return prevState.account !== nextState.account
      || !prevState.balance.equals(nextState.balance)
  },
})
export const BlockSub = createStatefulSub(fetchBlock)
export const NetworkAndTokensSub = createStatefulSub(getTokenListAndNetwork)
export const TokenBalancesSub = createStatefulSub(fetchTokenBalances)

// updates in AccountSub cause updates in ETHbalanceSub
AccountSub.subscribe(accountState => ETHbalanceSub.update(accountState.account))

const AccountAndTokenListSub = createMultiSub(AccountSub, NetworkAndTokensSub)
AccountAndTokenListSub.subscribe(([accountState, tokenListState]) =>
  TokenBalancesSub.update(accountState.account, tokenListState.tokenList),
)
// MultiSub does essentially the following:
// updates in AccountSub cause updates in TokenBalancesSub
// AccountSub.subscribe(accountState => TokenBalancesSub.update(
//   accountState.account, NetworkAndTokensSub.getState().tokenList,
// ))
// // updates in NetworkAndTokensSub cause updates in TokenBalancesSub
// NetworkAndTokensSub.subscribe(state => TokenBalancesSub.update(
//   AccountSub.getState().account, state.tokenList,
// ))

// Could be used inside AppValidator container as opposed to using this.startPolling()
export default async function startSubscriptions(isFilterSupported: boolean) {
  const { web3 } = await promisedWeb3(window.web3.currentProvider)

  // get initial state populated
  AccountSub.update()
  BlockSub.update()
  NetworkAndTokensSub.update()

  // trigger updates on interval
  const stateInterval = setInterval(() => {
    AccountSub.update()
    NetworkAndTokensSub.update()
    if (!isFilterSupported) BlockSub.update()
  }, SUBSCRIPTION_INTERVAL)

  let filter: any

  if (isFilterSupported) {
    // create filter listening for latest new blocks
    filter = web3.eth.filter('latest')
    // watch and update state on new block
    // oftentimes filter gets multiple blocks at once, only latest is the correct one
    // when multiple blocks are mined between watch interval checks, they are queued I guess
    // we need websockets
    const debouncedWatch = debounce(async (err: any, blockHash: any) => {
      console.debug('blockHash: ', blockHash)
      if (err) {
        console.debug(`Watch error: ${err}`)
        // TODO: some error subscription
      } else {
        // Update top-level subscriptions
        AccountSub.update()
        BlockSub.update(blockHash)
      }
    }, 250)

    filter.watch(debouncedWatch)
  }

  return () => {
    clearInterval(stateInterval)
    filter && filter.stopWatching()
  }
}
