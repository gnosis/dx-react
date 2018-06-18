import { push } from 'connected-react-router'
import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'

import {
  getLastAuctionPrice,
  depositAndSell,
  depositETH,
  getCurrentAccount,
  getDXTokenBalance,
  getEtherTokenBalance,
  getFeeRatio,
  getSellerOngoingAuctions,
  getTokenAllowance,
  getTokenBalances,
  postSellOrder,
  tokenApproval,
  getETHBalance,
  getTokenBalance,
  toNative,
  claimSellerFundsFromSeveralAuctions,
  getIndicesWithClaimableTokensForSellers,
  getLatestAuctionIndex,
  withdraw,
  getLockedMGNBalance,
} from 'api'

import {
  openModal,
  closeModal,
  setTokenBalance,
  setSellTokenAmount,
  setClosingPrice,
  setOngoingAuctions,
} from 'actions'


import { findDefaultProvider } from 'selectors/blockchain'

import { timeoutCondition } from '../utils/helpers'

import { BigNumber, TokenBalances, Account, State } from 'types'
import { promisedContractsMap } from 'api/contracts'
import { DefaultTokenObject } from 'api/types'
import { Dispatch } from 'react-redux'

export enum TypeKeys {
  SET_GNOSIS_CONNECTION = 'SET_GNOSIS_CONNECTION',
  SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS',
  SET_ACTIVE_PROVIDER = 'SET_ACTIVE_PROVIDER',
  SET_GAS_COST = 'SET_GAS_COST',
  SET_GAS_PRICE = 'SET_GAS_PRICE',
  REGISTER_PROVIDER = 'REGISTER_PROVIDER',
  UPDATE_PROVIDER = 'UPDATE_PROVIDER',
  SET_ETHER_TOKENS = 'SET_ETHER_TOKENS',
  OTHER_ACTIONS = 'OTHER_ACTIONS',
}

// TODO define reducer for GnosisStatus
export const setDutchXInitialized = createAction<{ initialized?: boolean, error?: any }>('SET_DUTCHX_CONNECTION')
export const setConnectionStatus = createAction<{ connected?: boolean }>('SET_CONNECTION_STATUS')
export const setActiveProvider = createAction<string>('SET_ACTIVE_PROVIDER')
export const registerProvider = createAction<{ provider?: string, data?: Object }>('REGISTER_PROVIDER')
export const updateProvider = createAction<{ provider?: string, data?: Object }>('UPDATE_PROVIDER')
export const setCurrentBalance = createAction<{ provider?: string, currentBalance?: BigNumber }>('SET_CURRENT_BALANCE')
export const setCurrentAccountAddress =
  createAction<{ provider?: string, currentAccount?: Object }>('SET_CURRENT_ACCOUNT_ADDRESS')
export const fetchTokens = createAction<{ tokens?: TokenBalances }>('FETCH_TOKENS')
export const setFeeRatio = createAction<{ feeRatio: number }>('SET_FEE_RATIO')
export const setTokenSupply = createAction<{ mgnSupply: string | BigNumber }>('SET_TOKEN_SUPPLY')
export const resetAppState = createAction('RESET_APP_STATE')

const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 200000

const setActiveProviderHelper = (dispatch: Dispatch<any>, state: State) => {
  try {
    // determine new provider
    const newProvider = findDefaultProvider(state)
    if (newProvider) {
      dispatch(batchActions([
        setActiveProvider(newProvider.name),
        setDutchXInitialized({ initialized: true }),
      ], 'SET_ACTIVE_PROVIDER_AND_INIT_DX_FLAG'))
    }
  } catch (error) {
    console.warn(`DutchX initialization Error: ${error}`)
    return dispatch(setDutchXInitialized({ error, initialized: false }))
  }
}

export const resetMainAppState = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  dispatch(resetAppState())
  const state = getState()
  // provider may have changed between resets
  setActiveProviderHelper(dispatch, state)
}

export const updateMainAppState = (condition?: any) => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { tokenList } = getState()
  const defaultList = tokenList.type === 'DEFAULT' ? tokenList.defaultTokenList : tokenList.combinedTokenList
  const [{ TokenMGN }, currentAccount] = await Promise.all([
    promisedContractsMap,
    getCurrentAccount(),
  ])
  const mainList = [...defaultList, { symbol: 'MGN', name: 'MAGNOLIA', decimals: 18, address: TokenMGN.address }]

  const status = condition.fn && typeof condition.fn === 'function' ? condition.fn && await condition.fn(...condition.args) : condition

  // Check state in parallel
  /*
    * Provider?
    * Account?
    * Balance (ETH)?
    * TokenBalances
    * OngoingAuctions
    * MGN fee ratio
    * localStorage changes
   */

  // TODO: if address doesnt exist in calcAlltokenBalances it throws and stops
  const [ongoingAuctions, tokenBalances, feeRatio, mgnLockedBalance] = await Promise.all([
    getSellerOngoingAuctions(mainList as DefaultTokenObject[], currentAccount),
    calcAllTokenBalances(mainList as DefaultTokenObject[]),
    getFeeRatio(currentAccount),
    getLockedMGNBalance(currentAccount),
  ])

  // TODO: remove
  console.log('OGA: ', ongoingAuctions, 'TokBal: ', tokenBalances, 'FeeRatio: ', feeRatio)

  // const mgn = tokenBalances.find(t => t.address === TokenMGN.address)

  // dispatch Actions
  dispatch(batchActions([
    ...tokenBalances.map(token =>
    setTokenBalance({ address: token.address, balance: token.balance })),
    setOngoingAuctions({ ongoingAuctions }),
    setFeeRatio({ feeRatio: feeRatio.toNumber() }),
    setTokenSupply({ mgnSupply: mgnLockedBalance.div(10 ** 18).toFixed(4) }),
    setCurrentAccountAddress({ currentAccount }),
  ], 'HYDRATING_MAIN_STATE'))

  return status
}

// CONSIDER: moving this OUT of blockchain into index or some INITIALIZATION action module.
/**
 * (Re)-Initializes DutchX connection according to current providers settings
 */
export const initDutchX = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  const state = getState()
  // initialize
  // determine new provider
  setActiveProviderHelper(dispatch, state)

  // connect
  try {
    let account: Account
    let currentBalance: BigNumber
    let tokenBalances:  { address: string, balance: BigNumber }[]
    // runs test executions on gnosisjs
    const getConnection = async () => {
      try {
        const tokenAddresses = state.tokenList.combinedTokenList
        account = await getCurrentAccount();
        ([currentBalance, tokenBalances] = await Promise.all([
          getETHBalance(account, true),
          calcAllTokenBalances(tokenAddresses),
        ]))
        return dispatch(getClosingPrice())
      } catch (e) {
        console.error(e)
        throw e
      }

    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])

    dispatch(setCurrentAccountAddress({ currentAccount: account }))
    dispatch(setCurrentBalance({ currentBalance }))

    // Grab each TokenBalance and dispatch
    dispatch(batchActions(tokenBalances.map(token =>
      setTokenBalance({ address: token.address, balance: token.balance })), 'SET_ALL_TOKEN_BALANCES'))

    return dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    console.error(`DutchX connection Error: ${error.message}`)
    return dispatch(setConnectionStatus({ connected: false }))
  }
}

export const getClosingPrice = () => async (dispatch: Dispatch<any>, getState: any) => {
  const { tokenPair: { buy, sell } } = getState()

  if (!sell || !buy) return console.warn('Sell or buy token not selected. Please make sure both tokens are selected')

  try {
    const currAucIdx = await getLatestAuctionIndex({ sell, buy })

    // Non started auction - return 0
    if (currAucIdx.lte(0)) return dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price: '0' }))

    const [pNum, pDen] = await getLastAuctionPrice({ sell, buy }, currAucIdx)
    const price = (pNum.div(pDen)).toFixed(4)
    console.log('lastClosingPrice -> ', price)

    return dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price }))
  } catch (e) {
    console.error(e)
  }
}

/**
 * checkUserStateAndSell()(dispatch, state) => THUNK Action
 *
*/
export const checkUserStateAndSell = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  const {
    tokenPair: { sell, sellAmount },
    blockchain: { activeProvider, currentAccount },
  } = getState(),
    sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address,
    nativeSellAmt = await toNative(sellAmount, sell.decimals),
    { TokenOWL } = await promisedContractsMap,
    // promised Token Allowance to get back later
    promisedTokensAndOWLBalance = Promise.all<boolean|BigNumber, BigNumber>([
      checkTokenAllowance(sell.address, nativeSellAmt, currentAccount),
      getTokenBalance(TokenOWL.address, currentAccount),
    ])

  try {
    // check ETHER deposit && start fetching allowance amount in ||
    const wrappedETH = await checkEthTokenBalance(sell.address, nativeSellAmt, currentAccount)
    // if SELLTOKEN !== ETH, returns undefined and skips
    if (wrappedETH) {
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Wrapping ${(wrappedETH as BigNumber).div(10 ** 18)} ${sellName}`,
          // tslint:disable-next-line
          body: `Confirmation: ${sellName} is not an ERC20 Token and must be wrapped - please check ${activeProvider}`,
          loader: true,
        },
      }))
      // TODO only deposit difference
      const depositReceipt = await depositETH(wrappedETH.toString(), currentAccount)
      console.log('​EtherToken Deposit receipt: ', depositReceipt)
    }
    // Check allowance amount for SELLTOKEN
    // if allowance is ok, skip
    const [needSellTokenAllowance, OWLBalance] = await promisedTokensAndOWLBalance
    if (needSellTokenAllowance) {
      const promisedChoice: Promise<string> = new Promise((accept) => {
        dispatch(openModal({
          modalName: 'ApprovalModal',
          modalProps: {
            header: `Confirm ${sellName} Token movement`,
            // tslint:disable-next-line
            body: `Confirmation: DutchX needs your permission to move your ${sellName} Tokens for this Auction - please check ${activeProvider}`,
            onClick: accept,
          },
        }))
      })
      const choice = await promisedChoice

      await dispatch(approveTokens(choice, 'SELLTOKEN'))
    // Go straight to sell order if deposit && allowance both good
    }

    console.log('​exportcheckUserStateAndSell -> OWLBalance ', OWLBalance)
    if (OWLBalance.gt(0)) {
      const needOWLAllowance = await checkTokenAllowance(TokenOWL.address, nativeSellAmt, currentAccount)
      if (needOWLAllowance) {
        const promisedChoice: Promise<string> = new Promise((accept) => {
          dispatch(openModal({
            modalName: 'ApprovalModal',
            modalProps: {
              header: `Approving OWL use for fees`,
              body: `You have OWL available in your linked wallet address. Would you like to use OWL to pay for half of the fees on the DutchX? Any fee reduction due to MGN is valid and applied before the fee calculation.`,
              buttons: {
                button1: {
                  buttonTitle1: 'Approve',
                  buttonDesc1: 'Choose this option to approve the use of OWL to pay for half of the fees on the DutchX',
                },
                button2: {
                  buttonTitle2: 'Disallow',
                  buttonDesc2: 'Choose this option if you do not want to use OWL',
                },
              },
              onClick: accept,
            },
          }))
        })
        const choice = await promisedChoice

        await dispatch(approveTokens(choice, 'OWLTOKEN'))
      }
    }
    return dispatch(submitSellOrder())
  } catch (e) {
    dispatch(errorHandling(e))
  }
}

export const submitSellOrder = () => async (dispatch: any, getState: () => State) => {
  const {
    tokenPair: { sell, buy, sellAmount, index = 0 },
    blockchain: { activeProvider, currentAccount, providers: { [activeProvider]: { network } } },
  }: State = getState(),
    sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address,
    buyName = buy.symbol.toUpperCase() || buy.name.toUpperCase() || buy.address,
    promisedAmtAndDXBalance = Promise.all([
      toNative(sellAmount, sell.decimals),
      getDXTokenBalance(sell.address, currentAccount),
    ])
  try {
    // don't do anything when submitting a <= 0 amount
    // indicate that nothing happened with false return
    if (+sellAmount <= 0) throw new Error('Invalid selling amount. Cannot sell 0.')

    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Sell Confirmation`,
        body: `Final confirmation: please accept/reject ${sellName} sell order via ${activeProvider}`,
        txData: {
          tokenA: sell,
          tokenB: buy,
          sellAmount,
          network,
        },
        loader: true,
      },
    }))
    // if user's sellAmt > DX.balance(token)
    // deposit(sellAmt) && postSellOrder(sellAmt)
    let receipt
    const [nativeSellAmt, userDXBalance] = await promisedAmtAndDXBalance
    if (nativeSellAmt.greaterThan(userDXBalance)) {
      receipt = await depositAndSell(sell, buy, nativeSellAmt.toString(), currentAccount)
      console.log('depositAndSell receipt', receipt)
    // else User has enough balance on DX for Token and can sell w/o deposit
    } else {
      receipt = await postSellOrder(sell, buy, nativeSellAmt.toString(), index as number, currentAccount)
      console.log('postSellOrder receipt', receipt)
    }
    const { args: { auctionIndex } } = receipt.logs.find((log: any) => log.event === 'NewSellOrder')
    console.log(`Sell order went to ${sellName}-${buyName}-${auctionIndex.toString()}`)
    dispatch(closeModal())

    // grab balance of sold token after sale
    const balance = await getTokenBalance(sell.address, currentAccount)

    // jump to Auction Page
    dispatch(push(`auction/${sellName}-${buyName}-${auctionIndex.toString()}`))
    // dispatch Actions
    dispatch(batchActions([
      setTokenBalance({ address: sell.address, balance }),
      // set sellAmount back to 0
      setSellTokenAmount({ sellAmount: '0' }),
    ], 'SUBMIT_SELL_ORDER_STATE_UPDATE'))
    // indicate that submission worked
    return true
  } catch (error) {
    dispatch(errorHandling(error))
  }
}

// TODO: if add index of current tokenPair to state
export const approveTokens = (choice: string, tokenType: 'SELLTOKEN' | 'OWLTOKEN') => async (dispatch: Dispatch<any>, getState: () => State) => {
  const {
    tokenPair: { sell, sellAmount },
    blockchain: { currentAccount },
  } = getState()
  const promisedNativeSellAmt = toNative(sellAmount, sell.decimals)
  const promisedContracts = promisedContractsMap
  const sellName = sell.symbol || sell.name || sell.address

  try {
    // don't do anything when submitting a <= 0 amount
    if (+sellAmount <= 0) throw new Error('Invalid selling amount. Cannot sell 0.')

    // SELLTOKEN APPROVAL
    if (tokenType === 'SELLTOKEN') {
      if (choice === 'MIN') {
        dispatch(openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `Approving minimum token movement`,
            body: `You are approving ${sellAmount} for this particular token [${sellName}]. For future transactions with this particular token, you will continue needing to sign two transactions.`,
            loader: true,
          },
        }))
        const nativeSellAmt = await promisedNativeSellAmt
        const tokenApprovalReceipt = await tokenApproval(sell.address, nativeSellAmt.toString())
        console.log('Approved token', tokenApprovalReceipt)
      } else {
        dispatch(openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `Approving maximum token movement`,
            body: `You are approving the maximum amount for this particular token [${sellName}]. You will no longer need to sign two transactions for this token going forward.`,
            loader: true,
          },
        }))
        // CONSIDER/TODO: move allowanceLeft into state
        const allowanceLeft = (await getTokenAllowance(sell.address, currentAccount)).toNumber()
        const tokenApprovalReceipt = await tokenApproval(sell.address, ((2 ** 255) - allowanceLeft).toString())
        console.log('Approved token', tokenApprovalReceipt)
      }
    // OWL APPROVAL
    } else {
      const { TokenOWL } = await promisedContracts
      if (choice === 'MAX') {
        dispatch(openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `Approving use of OWL`,
            body: `You are approving the use of OWL tokens towards fee reduction - you will not see this message again.`,
            loader: true,
          },
        }))
        // CONSIDER/TODO: move allowanceLeft into state
        const allowanceLeft = (await getTokenAllowance(TokenOWL.address, currentAccount)).toNumber()
        const tokenApprovalReceipt = await tokenApproval(TokenOWL.address, ((2 ** 255) - allowanceLeft).toString())
        console.log('Approved OWL', tokenApprovalReceipt)
      } else {
        console.log('Disallowing OWL')
        dispatch(closeModal())
      }
    }
  } catch (error) {
    throw error
  }
}

export const claimSellerFundsFromSeveral = (
  sell: DefaultTokenObject,
  buy: DefaultTokenObject,
  lastNIndex?: number,
) => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { blockchain: { activeProvider, currentAccount } } = getState(),
    sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address,
    buyName = buy.symbol.toUpperCase() || buy.name.toUpperCase() || buy.address
  try {
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Claiming Funds`,
        body: `Claiming ${buyName} tokens from ${sellName}-${buyName} auction. Please check ${activeProvider}`,
        loader: true,
      },
    }))
    const claimReceipt = await claimSellerFundsFromSeveralAuctions(sell, buy, currentAccount, lastNIndex)
    console.log('​Claim receipt => ', claimReceipt)
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Withdrawing Claimed Funds`,
        body: `Withdrawing ${buyName} tokens from ${sellName}-${buyName} auction. Please check ${activeProvider}`,
        loader: true,
      },
    }))
    const withdrawReceipt = await withdraw(buy.address)
    console.log('​withdrawReceipt => ', withdrawReceipt)
    // refresh state ...
    let [, sellBalance] = await dispatch(updateMainAppState({ fn: getIndicesWithClaimableTokensForSellers, args: [{ sell, buy }, currentAccount, 0] }))
    // loop until sellBalance drops to 0
    while (sellBalance.length && sellBalance[0].gt(0)) {
      ([, sellBalance] = await dispatch(updateMainAppState({ fn: getIndicesWithClaimableTokensForSellers, args: [{ sell, buy }, currentAccount, 0] })))
    }

    return dispatch(closeModal())
  } catch (error) {
    console.error(error.message)

    dispatch(errorHandling(error))
  }
}

/**
 * checkEthTokenBalance > returns false or EtherToken Balance
 * @param token
 * @param weiSellAmount
 * @param account
 * @returns boolean | BigNumber <false, amt>
 */
async function checkEthTokenBalance(
  tokenAddress: Account,
  weiSellAmount: BigNumber,
  account?: Account,
): Promise<boolean | BigNumber> {
  const { TokenETH } = await promisedContractsMap
  // BYPASS[return false] => if token is not ETHER
  if (tokenAddress !== TokenETH.address) return false
  // CONSIDER/TODO: wrappedETH in state or TokenBalance
  const wrappedETH = await getEtherTokenBalance(account)
  // BYPASS[return false] => if wrapped Eth is enough
  if (wrappedETH.gte(weiSellAmount)) return false

  return weiSellAmount.minus(wrappedETH)
}

/**
 * checkTokenAllowance > returns false or Token[name] Allowance
 * @param token
 * @param nativeSellAmt
 * @param account
 * @returns boolean | BigNumber <false, amt>
 */
async function checkTokenAllowance(
  tokenAddress: Account,
  nativeSellAmt: BigNumber,
  userAddress?: Account,
): Promise<boolean | BigNumber> {
  // perform checks
  const tokenAllowance = await getTokenAllowance(tokenAddress, userAddress)
  // return false if wrapped Eth is enough
  if (tokenAllowance.gte(nativeSellAmt)) return false

  return tokenAllowance
}

export function errorHandling(error: Error) {
  const errorFind = (string: string, toFind = '}', offset = 1) => {
    const place = string.search(toFind)
    return string.slice(place + offset)
  }
  return async (dispatch: Dispatch<any>, getState: Function) => {
    const { blockchain: { activeProvider } } = getState()
    const normError = error.message
    console.error(error.message)
    // close to unmount
    dispatch(closeModal())
    // go home stacy
    dispatch(push('/'))
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `TRANSACTION FAILED/CANCELLED`,
        body: `${activeProvider || 'Your provider'} has stopped your transaction. Please see below or console for more info:`,
        button: true,
        error: errorFind(normError),
      },
    }))
  }
}

async function calcAllTokenBalances(tokenList?: DefaultTokenObject[]) {
  const tokenBalances = (await getTokenBalances(tokenList))

  return tokenBalances
}
