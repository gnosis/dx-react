import { TokensInterface, TransactionObject } from './types'
import { Account, Balance, TokenCode } from 'types'
import { promisedContractsMap } from './contracts'

export const promisedTokens = init()

async function init(): Promise<TokensInterface> {

  const contractsMap = await promisedContractsMap

  const getToken = (code: TokenCode) => {
    const token = contractsMap[`Token${code}`]

    if (!token) throw new Error(`No Token contract for ${code} token`)

    return token
  }

  const getTokenBalance = async (code: TokenCode, account: Account) => getToken(code).balanceOf(account)

  const getTotalSupply = async (code: TokenCode) => getToken(code).getTotalSupply()

  const transfer = (code: TokenCode, to: Account, value: Balance, tx: TransactionObject) =>
    getToken(code).transfer(to, value, tx)

  const transferFrom = (code: TokenCode, from: Account, to: Account, value: Balance, tx: TransactionObject) =>
    getToken(code).transferFrom(from, to, value, tx)

  const approve = (code: TokenCode, spender: Account, value: Balance, tx: TransactionObject) =>
    getToken(code).approve(spender, value, tx)

  const allowance = async (code: TokenCode, owner: Account, spender: Account) =>
    getToken(code).allowance(owner, spender)

  return {
    getTokenBalance,
    getTotalSupply,
    transfer,
    transferFrom,
    approve,
    allowance,
  }
}
