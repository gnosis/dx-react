import dutchX from './initialization'

let promisedDX: Promise<any>

/**
 * Initializes connection to DutchX
 * @param {*dictionary} DUTCHX_OPTIONS
 */
export const initDutchXConnection = async (DUTCHX_OPTIONS: any) => {
  console.log(' ===> FIRING initDutchX ACTION')
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




















export const tokenPairSelect = async (
  contract: string, token1: string, token2: string, amount: number, proposedVal: number,
) => {

  console.log(contract, token1, token2, amount, proposedVal)

  const dx = await getDutchXConnection()

  // Accts to test with HttpProvider - if using Metamask you must check the testrpc accounts and add manually
  const accts = [...dx.web3.eth.accounts]
  const defaults = { from: accts[0], gas: 4712388, gasPrice: 100000000000 }
  console.log(accts)

  const Contracts = dx.contracts
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
  const newDX = await Contracts.DutchExchange.new(2, 1, sellToken.address, buyToken.address, DUTCHX.address, defaults)
  const dxa = newDX.address

  console.log(dxa)
}
