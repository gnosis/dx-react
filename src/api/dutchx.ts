import dutchX from './initialization'
import { weiToEth } from 'utils/helpers'

let dxInst: any

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchXConnection = async (DUTCHX_OPTIONS: any) => {
  console.log(' ===> FIRING initDutchX ACTION')
  try {
    dxInst = await dutchX.init(DUTCHX_OPTIONS)
    return dxInst
    // console.log('SUCCESS CONNECTING TO DUTCHX INSTANCE', dxInst)
  } catch (e) {
    console.log('ERROR CONNECTING TO DUTCHX INSTANCE', e.message)
    throw (e)
  }
}

/**
 * Returns an instance of the connection to DutchX
 */
export const getDutchXConnection: Function = async (): Promise<Object> => dxInst

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const dutchX = await getDutchXConnection()
  
  return await new Promise((resolve, reject) => dutchX.web3.eth.getAccounts(
    (e: Object, accounts: Object) => (e ? reject(e) : resolve(accounts[0]))),
  )
}

export const getAllAccounts = async () => {
  const dutchX = await getDutchXConnection()

  const accounts = await new Promise((resolve, reject) => dutchX.web3.eth.getAccounts((err: any, accts: any) => {
    err ? reject(err) : resolve(accts)
  }))
  console.log(accounts)
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account: Object) => {
  const dutchX = await getDutchXConnection()
  console.log('GET CONNECTION DUTCHX INSTANCE = ', dutchX)
  return await new Promise((resolve, reject) => dutchX.web3.eth.getBalance(
    account,
    (e: Object, balance: Object) => (e ? reject(e) : resolve(weiToEth(balance.toString()))),
  ))
}

export const tokenPairSelect = async (
  contract: string, token1: string, token2: string, amount: number, proposedVal: number,
) => {

  console.log(contract, token1, token2, amount, proposedVal)

  const dutchX = await getDutchXConnection()

  // Accts to test with HttpProvider - if using Metamask you must check the testrpc accounts and add manually
  const accts = [...dutchX.web3.eth.accounts]
  const defaults = { from: accts[0], gas: 4712388, gasPrice: 100000000000 }
  console.log(accts)

  const Contracts = dutchX.contracts
  const initialiser = accts[0]

  const seller = accts[1]
  const sellToken = await Contracts.Token.new(defaults)
  console.log(sellToken)
  await sellToken.approve(seller, 100, defaults)
  await sellToken.transferFrom(initialiser, seller, 100, defaults)

  const buyer = accts[2]
  const buyToken = await Contracts.Token.new(defaults)
  await buyToken.approve(buyer, 100, defaults)
  await buyToken.transferFrom(initialiser, buyer, 1000, defaults)

  const DUTCHX = await Contracts.Token.new(defaults)

  // create dx
  const dx = await Contracts.DutchExchange.new(2, 1, sellToken.address, buyToken.address, DUTCHX.address, defaults)
  const dxa = dx.address

  console.log(dxa)
}
