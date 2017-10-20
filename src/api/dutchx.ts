import dutchX from './initialisition'
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
  const dutchX = await getDutchXConnection()
  const dXFactory = await dutchX[contract]
  
  const token = await dXFactory.proposeExchange(dutchX.contracts.Token.at(token1), dutchX.contracts.Token.at(token2), amount, proposedVal)
  console.log(token)
}