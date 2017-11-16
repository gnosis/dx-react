import dutchX from './initialization'

let promisedDX: Promise<any>

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchXConnection = async (DUTCHX_OPTIONS: any) => {
  try {
    return promisedDX = dutchX.init(DUTCHX_OPTIONS)
  } catch (e) {
    console.log('ERROR CONNECTING TO DUTCHX INSTANCE', e.message)
    throw (e)
  }
}

/**
 * Returns an instance of the connection to DutchX
 */
export const getDutchXConnection = () => promisedDX

/**
 * Returns the default node account
 */
export const getCurrentAccount = async () => {
  const dx = await getDutchXConnection()
  
  return await new Promise((resolve, reject) => dx.web3.eth.getAccounts(
    (e: Object, accounts: Object) => (e ? reject(e) : resolve(accounts[0]))),
  )
}

export const getAllAccounts = async () => {
  const dx = await getDutchXConnection()

  const accounts = await new Promise((resolve, reject) => 
    dx.web3.eth.getAccounts((err: any, accts: any) => {
      err ? reject(err) : resolve(accts)
    }),
  )
  console.log(accounts)
}

/**
 * Returns the account balance in ETHER from TokenETH
 */
export const getCurrentBalance = async (account: Account) => {
  const dx = await getDutchXConnection()

  return await (await dx.TokenETH.balanceOf(account)).toNumber()
}

// TODO: probably extrapolate some parameterizable parts - ContractName in string form for example
export const getTokenBalances = async (account: Account) => {
  const dx = await getDutchXConnection()

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
