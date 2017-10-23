import dutchX from './initialization'
import { weiToEth } from 'utils/helpers'

let dutchXInst: any

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchXConnection = async (DUTCHX_OPTIONS: any) => {
  console.log(' ===> FIRING initDutchX ACTION') //eslint-disable-line
  try {
    dutchXInst = await dutchX.init(DUTCHX_OPTIONS)
    console.log('SUCCESS CONNECTING TO DUTCHX INSTANCE', dutchXInst) // eslint-disable-line no-console
  } catch (e) {
    console.log('ERROR CONNECTING TO DUTCHX INSTANCE', e.message) // eslint-disable-line no-console
    throw (e)
  }
}

/**
 * Returns an instance of the connection to DutchX
 */
export const getDutchXConnection: any = async () => dutchXInst

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

  const accounts = await new Promise( (resolve, reject) => dutchX.web3.eth.getAccounts((err: any, accts: any) => {
    err ? reject(err) : resolve(accts)
  }))
  console.log(accounts)
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account: Object) => {
  const dutchX = await getDutchXConnection()
  return await new Promise((resolve, reject) => dutchX.web3.eth.getBalance(
    account,
    (e: Object, balance: Object) => (e ? reject(e) : resolve(weiToEth(balance.toString()))),
  ))
}

export const tokenPairSelect = async (contract: string, token1: string, token2: string, amount: number, proposedVal: number) => {
  
  console.log(contract, token1, token2, amount, proposedVal)

  const dutchX = await getDutchXConnection()

  let accts = [...dutchX.web3.eth.accounts]
  console.log(accts)

  const Contracts = dutchX.contracts
  let initialiser = accts[0]
  
  let seller = accts[1]
  const sellToken = await Contracts.Token.new({from: accts[0]})
  await sellToken.approve(seller, 100)
  await sellToken.transferFrom(initialiser, seller, 100, {from: seller});

  let buyer = accts[2]
  const buyToken = await Contracts.Token.new({from: accts[0]})
  await buyToken.approve(buyer, 100)
  await buyToken.transferFrom(initialiser, buyer, 1000, {from: buyer});

  // const token = await dXFactory.proposeExchange(dutchX.contracts.Token.at(token1), dutchX.contracts.Token.at(token2), amount, proposedVal)
}