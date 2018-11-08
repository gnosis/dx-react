import tokensMap from 'api/apiTesting'
import { DefaultTokenList } from 'api/types'
import { promisedWeb3 } from 'api/web3Provider'

import { batchActions } from 'redux-batched-actions'
import { setCurrentAccountAddress, setCurrentBalance } from 'actions'

import { ETHEREUM_NETWORKS, RINKEBY_TOKEN_LIST_HASH, KOVAN_TOKEN_LIST_HASH, MAINNET_TOKEN_LIST_HASH, ETH_ADDRESS } from 'globals'
import { store } from 'components/App'

import { debounce } from 'lodash'

export const send = debounce((actions: any, args: any, BATCH_TYPE?: string) => {
  if (actions.length) {
      return store && store.dispatch(
        batchActions([
          ...actions.map((action: any, i: number) => action(args[i])),
        ], BATCH_TYPE))
    }

  return store && store.dispatch(actions(args))
}, 2000)

export const fetchAccountData = async () => {
  const web3 = await promisedWeb3()

  const account = await web3.getCurrentAccount()

  send(setCurrentAccountAddress, ({ currentAccount: account }))
  return { account }
}

export const fetchETHBalance = async (account: string) => {
  if (!account) return {}
  const web3 = await promisedWeb3()
  const balance = await web3.getETHBalance(account, true)

  send([
      setCurrentAccountAddress,
      setCurrentBalance,
    ],
      [
      { currentAccount: account },
      { currentBalance: balance },
      ], 'BATCH_ACCOUNT_AND_BALANCE')

  return { balance, account }
}

export const fetchBlock = async (hashOrNumber: string = 'latest') => {
  const web3 = await promisedWeb3()
  const block = await web3.getBlock(hashOrNumber)

  return { block }
}

export const getTokenListAndNetwork = async () => {
  const { getNetwork } = await promisedWeb3()

  const network = await getNetwork() || 'NONE'

  let defaultTokens

  switch (network) {
      case '4':
      case ETHEREUM_NETWORKS.RINKEBY:
        console.log(`Detected  to ${ETHEREUM_NETWORKS.RINKEBY}`)
        defaultTokens = {
          hash: RINKEBY_TOKEN_LIST_HASH,
          tokens: process.env.FE_CONDITIONAL_ENV === 'production'
            ?
            require('../../../test/resources/token-lists/RINKEBY/prod-token-list.json') as any
            :
            require('../../../test/resources/token-lists/RINKEBY/dev-token-list.json') as any,
        }
        console.log('Rinkeby Token List:', defaultTokens.tokens.elements)
        break

      case '42':
      case ETHEREUM_NETWORKS.KOVAN:
        console.log(`Detected connection to ${ETHEREUM_NETWORKS.KOVAN}`)
        defaultTokens = {
          hash: KOVAN_TOKEN_LIST_HASH,
          tokens: require('../../../test/resources/token-lists/KOVAN/prod-token-list.json') as any,
        }
        console.log('Rinkeby Token List:', defaultTokens.tokens.elements)
        break

      case '1':
      case ETHEREUM_NETWORKS.MAIN:
        console.log(`Detected connection to ${ETHEREUM_NETWORKS.MAIN}`)

        defaultTokens = {
          hash: MAINNET_TOKEN_LIST_HASH,
          tokens: require('../../../test/resources/token-lists/MAINNET/prod-token-list.json') as any,
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
export const fetchTokenBalances = async (account: string, tokenList: DefaultTokenList) => {
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
