import dutchX from './initialization'
// import { weiToEth } from 'utils/helpers'

let dxInst: any

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchXConnection = async (DUTCHX_OPTIONS: any) => {
  console.log(' ===> FIRING initDutchX ACTION')
  try {
    return dxInst = await dutchX.init(DUTCHX_OPTIONS)
  } catch (e) {
    console.log('initDutchXConnection [api/dutchX.ts] ERROR: ', e.message)
    throw (e)
  }
}

/**
 * Returns an instance of the connection to DutchX
 */
export const getDutchXConnection = () => dxInst

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const dx = getDutchXConnection()
  
  return await new Promise((resolve, reject) => dx.web3.eth.getAccounts(
    (e: Object, accounts: Object) => (e ? reject(e) : resolve(accounts[0]))),
  )
}

export const getAllAccounts = async () => {
  const dx = getDutchXConnection()

  const accounts = await new Promise((resolve, reject) => dx.web3.eth.getAccounts((err: any, accts: any) => {
    err ? reject(err) : resolve(accts)
  }))
  console.log(accounts)
}

/**
 * Returns the account balance
 */
export const getCurrentBalance = async (account: Account) => {
  const dx = getDutchXConnection()

  return (await dx.TokenETH.balanceOf(account)).toNumber()
}

// TODO: probably extrapolate some parameterizable parts - ContractName in string form for example
export const getTokenBalances = async (account: Account) => {
  const dx = getDutchXConnection()

  const ETH = {
    name: 'ETH', 
    balance: (await dx.TokenETH.balanceOf(account)).toNumber(),
  }
  const GNO = {
    name: 'GNO', 
    balance: (await dx.TokenGNO.balanceOf(account)).toNumber(),
  }

  return [ETH, GNO]
}
