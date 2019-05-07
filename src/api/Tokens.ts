import { HumanFriendlyToken, promisedContractsMap } from 'api/contracts'

import { TokensInterface, TransactionObject } from './types'
import { Account, Balance } from 'types'
import { ETH_ADDRESS } from 'tokens'
import { estimateGas } from 'utils'

let tokensAPI: TokensInterface

export const promisedTokens = async () => {
  if (tokensAPI) return tokensAPI

  tokensAPI = await init()
  return tokensAPI
}

async function init(): Promise<TokensInterface> {

  const contractsMap = await promisedContractsMap()

  const getToken = (tokenAddress: Account) => {
    if (tokenAddress === ETH_ADDRESS) tokenAddress = contractsMap.TokenETH.address
    try {
      return HumanFriendlyToken.at(tokenAddress)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const getTokenDecimals = (tokenAddress: Account) => getToken(tokenAddress).decimals.call()

  const getTokenBalance = (tokenAddress: Account, account: Account) => getToken(tokenAddress).balanceOf(account)

  const getTotalSupply = (tokenAddress: Account) => getToken(tokenAddress).totalSupply()

  const transfer = (tokenAddress: Account, to: Account, value: Balance, tx: TransactionObject) =>
    estimateGas({ cb: getToken(tokenAddress).transfer, mainParams: [to, value], txParams: tx })

  const transferFrom = (tokenAddress: Account, from: Account, to: Account, value: Balance, tx: TransactionObject) =>
    estimateGas({ cb: getToken(tokenAddress).transferFrom, mainParams: [from, to, value], txParams: tx })

  const approve: TokensInterface['approve'] = (tokenAddress: Account, spender: Account, value: Balance, tx: TransactionObject) =>
    estimateGas({ cb: getToken(tokenAddress).approve, mainParams: [spender, value], txParams: tx })

  approve.sendTransaction = (tokenAddress: Account, spender: Account, value: Balance, tx: TransactionObject) =>
    estimateGas({ cb: getToken(tokenAddress).approve, mainParams: [spender, value], txParams: tx }, 'sendTransaction')

  const allowance = (tokenAddress: Account, owner: Account, spender: Account) =>
    estimateGas({ cb: getToken(tokenAddress).allowance, mainParams: [owner, spender] })

  const eth = contractsMap['TokenETH']

  const ethTokenBalance = (owner: Account) => eth.balanceOf(owner)

  const depositETH: TokensInterface['depositETH'] = (tx: TransactionObject & {value: TransactionObject['value']}) =>
    estimateGas({ cb: eth.deposit, mainParams: [], txParams: tx })

  depositETH.sendTransaction = (tx: TransactionObject & {value: TransactionObject['value']}) =>
    estimateGas({ cb: eth.deposit, mainParams: [], txParams: tx }, 'sendTransaction')

  const withdrawETH = (value: Balance, tx: TransactionObject) =>
    estimateGas({ cb: eth.withdraw, mainParams: [value], txParams: tx })

  return {
    getTokenDecimals,
    getTokenBalance,
    getTotalSupply,
    transfer,
    transferFrom,
    approve,
    allowance,

    ethTokenBalance,
    depositETH,
    withdrawETH,
  }
}
