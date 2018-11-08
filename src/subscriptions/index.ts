import createStatefulSub, { createMultiSub } from './genericSub'
import { promisedWeb3 } from 'api/web3Provider'
import { SUBSCRIPTION_INTERVAL, ETHEREUM_NETWORKS, RINKEBY_TOKEN_LIST_HASH, KOVAN_TOKEN_LIST_HASH, MAINNET_TOKEN_LIST_HASH, ETH_ADDRESS } from 'globals'

import { debounce } from 'lodash'
// import { getTokenBalances } from 'api'

import tokensMap from 'api/apiTesting'
import { DefaultTokenList } from 'api/types'
import { toBN } from 'api'

// instantiate early to avoid some race conditions
// TODO: make do without this ugliness
promisedWeb3(window.web3.currentProvider)

const fetchAccountData = async () => {
  const web3 = await promisedWeb3()

  const account = await web3.getCurrentAccount()

  return { account }
}

const fetchETHBalance = async (account: string) => {
  if (!account) return {}
  const web3 = await promisedWeb3()
  const balance = await web3.getETHBalance(account, true)

  return { balance, account }
}

const fetchBlock = async (hashOrNumber: string = 'latest') => {
  const web3 = await promisedWeb3()
  const block = await web3.getBlock(hashOrNumber)

  return { block }
}

const getTokenListAndNetwork = async () => {
  const { getNetwork } = await promisedWeb3()

  const network = await getNetwork() || 'NONE'

  let defaultTokens

  switch (network) {
    case '4':
    case ETHEREUM_NETWORKS.RINKEBY:
      console.log(`Detected connection to ${ETHEREUM_NETWORKS.RINKEBY}`)
      defaultTokens = {
        hash: RINKEBY_TOKEN_LIST_HASH,
        tokens: process.env.FE_CONDITIONAL_ENV === 'production'
          ?
          require('../../test/resources/token-lists/RINKEBY/prod-token-list.json') as any
          :
          require('../../test/resources/token-lists/RINKEBY/dev-token-list.json') as any,
      }
      console.log('Rinkeby Token List:', defaultTokens.tokens.elements)
      break

    case '42':
    case ETHEREUM_NETWORKS.KOVAN:
      console.log(`Detected connection to ${ETHEREUM_NETWORKS.KOVAN}`)
      defaultTokens = {
        hash: KOVAN_TOKEN_LIST_HASH,
        tokens: require('../../test/resources/token-lists/KOVAN/prod-token-list.json') as any,
      }
      console.log('Rinkeby Token List:', defaultTokens.tokens.elements)
      break

    case '1':
    case ETHEREUM_NETWORKS.MAIN:
      console.log(`Detected connection to ${ETHEREUM_NETWORKS.MAIN}`)

      defaultTokens = {
        hash: MAINNET_TOKEN_LIST_HASH,
        tokens: require('../../test/resources/token-lists/MAINNET/prod-token-list.json') as any,
      }
      console.log('Mainnet Token List:', defaultTokens.tokens.elements)
      break

    case 'NONE':
      console.error('No Web3 instance detected - please check your wallet provider.')
      break

    default:
      console.log('Detected connection to an UNKNOWN network -- localhost?')
      defaultTokens = {
        hash: 'local',
        tokens: await tokensMap('1.0'),
      }
      console.log('LocalHost Token List: ', defaultTokens.tokens.elements)
      break
  }

  return { network, tokenList: defaultTokens.tokens.elements }

}
const fetchTokenBalances = async (account: string, tokenList: DefaultTokenList) => {
  if (!account || !tokenList) return {}
  // breaks for now
  // return getTokenBalances(tokenList, account)
  // so use a fun hack
  const { web3 } = await promisedWeb3()

  const toReadableBalance = (balStr: string, dec: number) => web3.toBigNumber(balStr).div(10 ** dec)

  const promisedBalances = tokenList.map(async token => {
    if (token.address === ETH_ADDRESS) return { ETH: (await fetchETHBalance(account)).balance }

    const callRequest = {
      method: 'eth_call',
      params:
      [{
          to: token.address,
          // this is encoded abi for balanceOf(address)
          data: `0x70a08231000000000000000000000000${account.replace('0x', '')}`,
        }],
    }

    toBN

    return new Promise(resolve =>
      web3.currentProvider.sendAsync(callRequest,
        (err: Error, res: any) => resolve(
          { [token.symbol]: err ? web3.toBigNumber(0) : toReadableBalance(res.result, token.decimals) },
        ),
      ))
  },
  )

  const balances = await Promise.all(promisedBalances)

  return balances.reduce((accum, pair) => ({ ...accum, ...pair }), {})
}

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
