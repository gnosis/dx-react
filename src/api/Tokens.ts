import { HumanFriendlyToken, promisedContractsMap } from 'api/contracts'

import { TokensInterface, TransactionObject } from './types'
import { Account, Balance } from 'types'

export const promisedTokens = init()

async function init(): Promise<TokensInterface> {

  const contractsMap = await promisedContractsMap

  const getToken = (tokenAddress: Account) => {
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
    getToken(tokenAddress).transfer(to, value, tx)

  const transferFrom = (tokenAddress: Account, from: Account, to: Account, value: Balance, tx: TransactionObject) =>
    getToken(tokenAddress).transferFrom(from, to, value, tx)

  const approve = (tokenAddress: Account, spender: Account, value: Balance, tx: TransactionObject) =>
    getToken(tokenAddress).approve(spender, value, tx)

  const allowance = (tokenAddress: Account, owner: Account, spender: Account) =>
    getToken(tokenAddress).allowance(owner, spender)

  const eth = contractsMap['TokenETH']

  const ethTokenBalance = (owner: Account) => eth.balanceOf(owner)

  const depositETH = (tx: TransactionObject & {value: TransactionObject['value']}) => eth.deposit(tx)

  const withdrawETH = (value: Balance, tx: TransactionObject) => eth.withdraw(value, tx)

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
