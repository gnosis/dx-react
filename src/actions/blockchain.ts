import { push } from 'connected-react-router'
import { Dispatch } from 'react-redux'
import { createAction } from 'redux-actions'
import { batchActions } from 'redux-batched-actions'

import localForage from 'localforage'

import { findDefaultProvider } from 'selectors/blockchain'
import { getTokenName } from 'selectors/tokens'

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
  getLatestAuctionIndex,
  withdraw,
  getLockedMGNBalance,
  claimSellerFundsAndWithdraw,
  getSellerBalance,
  getAllTokenDecimals,
  getApprovedTokensFromAllTokens,
  getAvailableAuctionsFromAllTokens,
} from 'api'

import { promisedContractsMap, contractsMap } from 'api/contracts'
import tokensMap from 'api/apiTesting'
import { getDecoderForABI, checkTokenListJSON } from 'api/utils'
import { promisedIPFS } from 'api/IPFS'

import {
  openModal,
  closeModal,
  setTokenBalance,
  setSellTokenAmount,
  setClosingPrice,
  setOngoingAuctions,
  selectTokenPair,
  setCustomTokenList,
  setDefaultTokenList,
  setIPFSFileHashAndPath,
  setTokenListType,
  setApprovedTokens,
  setAvailableAuctions,
  setTokenListVersion,
} from 'actions'

import { timeoutCondition } from '../utils/helpers'

import { BigNumber, TokenBalances, Account, State, TokenPair } from 'types'
import { DefaultTokenObject, Web3EventLog, DefaultTokens, DefaultTokenList } from 'api/types'

import { waitForTx } from 'integrations/filterChain'
import { ETHEREUM_NETWORKS } from 'integrations/constants'

import { ETH_ADDRESS, FIXED_DECIMALS, NETWORK_TIMEOUT, RINKEBY_TOKEN_LIST_HASH, MAINNET_TOKEN_LIST_HASH, TokenListHashMap } from 'globals'
import { setDxBalances, getAllDXTokenInfo } from 'actions/dxBalances'

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
export const setConnectionStatus = createAction<{ connected?: boolean }>('SET_DUTCHX_CONNECTION_STATUS')
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

// resets app state if disconnection or exceptions caught
// this function causes the App flashes
export const resetMainAppState = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  dispatch(resetAppState())
  const state = getState()
  // provider may have changed between resets
  setActiveProviderHelper(dispatch, state)
}

// Updates main aspects of state relevant to user - called in polling functions in AppValidator
export const updateMainAppState = (condition?: any) => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { tokenList } = getState()
  const defaultList = tokenList.type === 'DEFAULT' ? tokenList.defaultTokenList : tokenList.combinedTokenList
  const [{ TokenMGN }, currentAccount] = await Promise.all([
    promisedContractsMap,
    getCurrentAccount(),
  ])
  const mainList = [...defaultList, { symbol: 'MGN', name: 'MAGNOLIA', decimals: 18, address: TokenMGN.address }]

  const status = condition && condition.fn && typeof condition.fn === 'function' ? condition.fn && await condition.fn(...condition.args) : condition

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
  const [ongoingAuctions, tokenBalances, feeRatio, mgnLockedBalance, dxTokenBalances] = await Promise.all([
    getSellerOngoingAuctions(mainList as DefaultTokenObject[], currentAccount),
    calcAllTokenBalances(mainList as DefaultTokenObject[]),
    getFeeRatio(currentAccount),
    getLockedMGNBalance(currentAccount),
    getAllDXTokenInfo(mainList as DefaultTokenObject[], currentAccount),
  ])
  const { balance } = tokenBalances.find((t: typeof tokenBalances[0]) => t.address === ETH_ADDRESS)

  // TODO: remove
  console.log('OGA: ', ongoingAuctions, 'TokBal: ', tokenBalances, 'FeeRatio: ', feeRatio, 'DXTokenBalances: ', dxTokenBalances.map(({ symbol, address, balance: i }: any) => ({ symbol, address, balance: i.div(10 ** 18).toFixed(4) })))

  // dispatch Actions
  dispatch(batchActions([
    ...tokenBalances.map((token: typeof tokenBalances[0]) =>
      setTokenBalance({ address: token.address, balance: token.balance })),
    ...dxTokenBalances.map(({ address, balance }: typeof tokenBalances[0]) =>
      setDxBalances({ address, balance })),
    setOngoingAuctions(ongoingAuctions),
    setFeeRatio({ feeRatio: feeRatio.toNumber() }),
    setTokenSupply({ mgnSupply: mgnLockedBalance.div(10 ** 18).toFixed(FIXED_DECIMALS) }),
    setCurrentAccountAddress({ currentAccount }),
    setCurrentBalance({ currentBalance: balance.div(10 ** 18) }),
  ], 'HYDRATING_MAIN_STATE'))

  return status
}

/**
 * (Re)-Initializes DutchX connection according to current providers settings
 */
export const initDutchX = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  const state = getState(),
    {
      blockchain: { providers },
      tokenList: { combinedTokenList: tokenAddresses },
    } = state

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
        if (!providers.METAMASK) throw 'MetaMask not detected, please check that you have MetaMask properly installed and configured.'
        if (!providers.METAMASK.unlocked) throw 'Wallet Provider LOCKED - please unlock your wallet'
        account = await getCurrentAccount();
        ([currentBalance, tokenBalances] = await Promise.all([
          getETHBalance(account, true),
          calcAllTokenBalances(tokenAddresses),
        ]))
      } catch (e) {
        throw e
      }
    }
    await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])

    // batch init dutchX actions
    dispatch(
      batchActions([
        setCurrentAccountAddress({ currentAccount: account }),
        setCurrentBalance({ currentBalance }),
        // dispatches array of tokenBalances
        ...tokenBalances.map(token =>
          setTokenBalance({ address: token.address, balance: token.balance })),
      ], 'SETTING_UP_DUTCH_X'),
      )

    return dispatch(setConnectionStatus({ connected: true }))
  } catch (error) {
    dispatch(setConnectionStatus({ connected: false }))
    throw error
  }
}

export const setApprovedTokensAndAvailableAuctions = (tokenList: DefaultTokenList) => async (dispatch: Dispatch<any>) => {
  console.log('​exportsetApprovedTokensAndAvailableAuctions -> tokenList', tokenList)
  const [approvedTokenAddresses, availableAuctions] = await Promise.all([
    getApprovedTokensFromAllTokens(tokenList),
    getAvailableAuctionsFromAllTokens(tokenList),
  ])

  console.log(`
    APPROVED TOKEN ADDRESSES: ${JSON.stringify(approvedTokenAddresses, undefined, 2)}
    AVAILABLE AUCTIONS: ${JSON.stringify(availableAuctions, undefined, 2)}
  `)

  dispatch(setApprovedTokens(approvedTokenAddresses))
  dispatch(setAvailableAuctions(availableAuctions))
}

export const getTokenList = (network?: number | string) => async (dispatch: Dispatch<any>, getState: () => State): Promise<void> => {
  let [defaultTokens, customTokens, customListHash] = await Promise.all<{ hash: string, tokens: DefaultTokens}, DefaultTokens['elements'], string>([
    localForage.getItem('defaultTokens'),
    localForage.getItem('customTokens'),
    localForage.getItem('customListHash'),
  ])

  const { ipfsFetchFromHash } = await promisedIPFS

  // when switching Networks, NetworkListeners in events.js should delete localForage tokenList
  // meaning this would be FALSE on network change and app reset
  // check that localForage has both something in defaultTokens AND that the localForage hash === the local latest hash in globals
  const areTokensAvailableAndUpdated = defaultTokens && defaultTokens.hash === TokenListHashMap[network]

  if (!areTokensAvailableAndUpdated) {
    network = network || window.web3.version.network || 'NONE'

    // user has tokens in localStorage BUT hash is not updated
    if (defaultTokens) await localForage.removeItem('defaultTokens')

    switch (network) {
      case '4':
      case ETHEREUM_NETWORKS.RINKEBY:
        console.log(`Detected connection to ${ETHEREUM_NETWORKS.RINKEBY}`)
        defaultTokens = {
          hash: RINKEBY_TOKEN_LIST_HASH,
          tokens: await fetch(`https://gateway.ipfs.io/ipfs/${RINKEBY_TOKEN_LIST_HASH}`)
          .then(tokenList => tokenList.json())
          .catch(err => {
            console.error(err, 'IPFS fetch error - defaulting to local tokens')
            return require('../../test/resources/token-lists/RINKEBY/token-list.json')
          }),
        }
        console.log('Rinkeby Token List:', defaultTokens.tokens.elements)
        break

      case '1':
      case ETHEREUM_NETWORKS.MAIN:
        console.log(`Detected connection to ${ETHEREUM_NETWORKS.MAIN}`)
        // TODO: fix for Mainnet

        defaultTokens = {
          hash: MAINNET_TOKEN_LIST_HASH,
          tokens: await fetch(`https://gateway.ipfs.io/ipfs/${MAINNET_TOKEN_LIST_HASH}`)
          .then(tokenList => tokenList.json())
          .catch(err => {
            console.error(err, 'IPFS fetch error - defaulting to local tokens')
            return require('../../test/resources/token-lists/MAINNET/token-list.json')
          }),
        }

        console.warn(`
          Ethereum Mainnet not supported - please try another network.
        `)
        break

      case 'NONE':
        console.error('No Web3 instance detected - please check your wallet provider.')
        break

      default:
        console.log(`Detected connection to an UNKNOWN network -- localhost?`)
        defaultTokens = {
          hash: 'local',
          tokens: await tokensMap('1.0'),
        }
        console.log('LocalHost Token List: ', defaultTokens.tokens.elements)
        break
    }

    // set tokens to localForage
    await localForage.setItem('defaultTokens', defaultTokens)
  }

  // Set user's custom IPFS hash for tokens exists in localForage
  if (customListHash) dispatch(setIPFSFileHashAndPath({ fileHash: customListHash }))

  if (customTokens) {
    const customTokensWithDecimals = await getAllTokenDecimals(customTokens)

    // reset localForage customTokens w/decimals filled in
    localForage.setItem('customTokens', customTokensWithDecimals)
    dispatch(setCustomTokenList({ customTokenList: customTokensWithDecimals }))
    dispatch(setTokenListType({ type: 'CUSTOM' }))
  }
  else if (customListHash) {
    const fileContent = await ipfsFetchFromHash(customListHash)

    const json = fileContent
    await checkTokenListJSON(json as DefaultTokenObject[])

    const customTokensWithDecimals = await getAllTokenDecimals(json  as DefaultTokenObject[])
    localForage.setItem('customTokens', customTokensWithDecimals)

    dispatch(setCustomTokenList({ customTokenList: customTokensWithDecimals }))
    dispatch(setTokenListType({ type: 'CUSTOM' }))
  }
  // set defaulTokenList && setDefaulTokenPair visible when in App
  dispatch(batchActions([
    setDefaultTokenList({ defaultTokenList: defaultTokens.tokens.elements }),
    setTokenListVersion({ version: defaultTokens.tokens.version }),
  ]))

  // set approved list, available auctions
  const { combinedTokenList: finalTokenList } = getState().tokenList
  return dispatch(setApprovedTokensAndAvailableAuctions(finalTokenList))
}

export const getClosingPrice = () => async (dispatch: Dispatch<any>, getState: any) => {
  let { tokenPair: { buy, sell } } = getState()

  if (!sell || !buy) return console.warn('Sell or buy token not selected. Please make sure both tokens are selected')

  if (sell.address === ETH_ADDRESS || buy.address === ETH_ADDRESS) {
    const { TokenETH } = await promisedContractsMap
    if (sell.address === ETH_ADDRESS) {
      sell = TokenETH
    } else {
      buy = TokenETH
    }
  }

  // show intermittent loading until price calculated
  dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price: 'LOADING' }))

  try {
    const currAucIdx = await getLatestAuctionIndex({ sell, buy })

    // Non started auction - return 0
    if (currAucIdx.lte(0)) return dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price: '0' }))

    const [pNum, pDen] = await getLastAuctionPrice({ sell, buy }, currAucIdx)
    const price = (pNum.div(pDen)).toFixed(FIXED_DECIMALS)
    console.log('lastClosingPrice -> ', price)

    return dispatch(setClosingPrice({ sell: sell.symbol, buy: buy.symbol, price }))
  } catch (e) {
    console.error(e)
  }
}

const changeETHforWETH = (dispatch: Dispatch<any>, getState: () => State, TokenETHAddress: Account) => {
  let { tokenPair: { sell, buy, sellAmount }, tokenList: { defaultTokenList } } = getState()
  if (sell.isETH || buy.isETH) {
    if (sell.isETH) sell = defaultTokenList.find(token => token.address === TokenETHAddress)
    if (buy.isETH) buy = defaultTokenList.find(token => token.address === TokenETHAddress)

    dispatch(selectTokenPair({ sell, buy, sellAmount }))
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
  } = getState()
  let sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address
  const nativeSellAmt = await toNative(sellAmount, sell.decimals),
    { TokenOWL, TokenETH } = await promisedContractsMap,
    // promised Token Allowance to get back later
    promisedTokensAndOWLBalance = Promise.all<boolean|BigNumber, BigNumber>([
      checkTokenAllowance(sell.isETH ? TokenETH.address : sell.address, nativeSellAmt, currentAccount),
      getTokenBalance(TokenOWL.address, currentAccount),
    ])

  try {
    // check ETHER deposit && start fetching allowance amount in ||
    const ETHToWrap = await checkEthTokenBalance(sell, nativeSellAmt, currentAccount)
    // if SELLTOKEN !== ETH, returns undefined and skips
    if (ETHToWrap) {
      dispatch(openModal({
        modalName: 'TransactionModal',
        modalProps: {
          header: `Wrapping ${(ETHToWrap as BigNumber).div(10 ** 18)} ${sellName}`,
          // tslint:disable-next-line
          body: `
            ${sellName} is not an ERC20 Token and must be wrapped.
            In case you already have wrapped ${sellName}, you are confirming to wrap the remainder.

            Please confirm with ${activeProvider}.
          `,
          loader: true,
        },
      }))
      // TODO: only deposit difference
      console.log('PROMPTING to start depositETH tx')
      const depositHash = await depositETH.sendTransaction(ETHToWrap.toString(), currentAccount)
      console.log('​depositETH tx hash: ', depositHash)
    }
    // if sell or buy is unwrapped ETH replace token with previously WETH
    changeETHforWETH(dispatch, getState, TokenETH.address)
    // Check allowance amount for SELLTOKEN
    // if allowance is ok, skip
    const [needSellTokenAllowance, OWLBalance] = await promisedTokensAndOWLBalance
    if (needSellTokenAllowance) {
      ({ symbol: sellName } = getTokenName(sell))

      const promisedChoice: Promise<string> = new Promise((accept) => {
        dispatch(openModal({
          modalName: 'ApprovalModal',
          modalProps: {
            header: `Confirm ${sellName} token transfer`,
            // tslint:disable-next-line
            body: `The DutchX needs your permission to transfer your ${sellName}.`,
            buttons: {
              button1: {
                buttonTitle1: `Approve ${sellName} for this trade only`,
              },
              button2: {
                buttonTitle2: `Approve ${sellName} also for future trades`,
              },
            },
            footer: {
              msg: `If you are unsure, select “Approve ${sellName} for this trade only”.`,
              url: './content/FAQ',
              urlMsg: 'FAQ',
            },
            onClick: accept,
          },
        }))
      })
      const choice = await promisedChoice

      await dispatch(approveTokens(choice, 'SELLTOKEN'))
    // Go straight to sell order if deposit && allowance both good
    }

    if (OWLBalance.gt(0)) {
      const needOWLAllowance = await checkTokenAllowance(TokenOWL.address, nativeSellAmt, currentAccount)
      if (needOWLAllowance) {
        const promisedChoice: Promise<string> = new Promise((accept) => {
          dispatch(openModal({
            modalName: 'ApprovalModal',
            modalProps: {
              header: `Using OWL to pay for fees`,
              body: `You have the option to pay half of your fees on the DutchX in OWL.
              Any fee reduction due to your MGN token balance remains valid and is applied before the final fee calculation.
              `,
              buttons: {
                button2: {
                  buttonTitle2: 'Use OWL to pay for fees',
                },
                button1: {
                  buttonTitle1: 'Don\'t use OWL to pay for fees',
                },
              },
              footer: {
                url: './content/Fees',
                urlMsg: 'Fees',
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
    sellName = getTokenName(sell),
    buyName = getTokenName(buy),
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
        header: `Order confirmation`,
        body: `Final confirmation: Please confirm/cancel your ${sellName.symbol} order via ${activeProvider || 'your wallet provider'}. Your deposit will be placed into the next running auction. You are submitting your order to the blockchain. Processing the transaction may take a while. `,
        txData: {
          tokenA: { ...sell, ...sellName } as DefaultTokenObject,
          tokenB: { ...buy, ...buyName } as DefaultTokenObject,
          sellAmount,
          network,
        },
        loader: true,
      },
    }))
    // if user's sellAmt > DX.balance(token)
    // deposit(sellAmt) && postSellOrder(sellAmt)
    let hash: string
    const [nativeSellAmt, userDXBalance] = await promisedAmtAndDXBalance
    if (nativeSellAmt.greaterThan(userDXBalance)) {

      console.log('PROMPTING to start depositAndSell tx')
      hash = await depositAndSell.sendTransaction(sell, buy, nativeSellAmt.toString(), currentAccount)
      console.log('depositAndSell tx hash', hash)
    // else User has enough balance on DX for Token and can sell w/o deposit
    } else {

      console.log('PROMPTING to start depositAndSell tx')
      hash = await postSellOrder.sendTransaction(sell, buy, nativeSellAmt.toString(), index as number, currentAccount)
      console.log('postSellOrder tx hash', hash)
    }
    const receipt = await waitForTx(hash)
    console.log('postSellOrder tx receipt: ', receipt)

    const { DutchExchange } = contractsMap
    const decoder = getDecoderForABI(DutchExchange.abi)
    const logs = decoder(receipt.logs)
    console.log('postSellOrder tx logs', logs)
    const { auctionIndex } = logs.find((log: Web3EventLog) => log._eventName === 'NewSellOrder')

    // let receipt
    // const [nativeSellAmt, userDXBalance] = await promisedAmtAndDXBalance
    // if (nativeSellAmt.greaterThan(userDXBalance)) {
    //   receipt = await depositAndSell(sell, buy, nativeSellAmt.toString(), currentAccount)
    //   console.log('depositAndSell receipt', receipt)
    // // else User has enough balance on DX for Token and can sell w/o deposit
    // } else {
    //   receipt = await postSellOrder(sell, buy, nativeSellAmt.toString(), index as number, currentAccount)
    //   console.log('postSellOrder receipt', receipt)
    // }
    // const { args: { auctionIndex } } = receipt.logs.find((log: any) => log.event === 'NewSellOrder')

    console.log(`Sell order went to ${sellName.symbol}-${buyName.symbol}-${auctionIndex.toString()}`)
    dispatch(closeModal())
    // jump to Auction Page
    dispatch(push(`auction/${sellName.symbol}-${buyName.symbol}-${auctionIndex.toString()}`))

    // grab balance of sold token after sale
    const balance = await getTokenBalance(sell.address, currentAccount)

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
    blockchain: { activeProvider, currentAccount },
  } = getState()
  const promisedNativeSellAmt = toNative(sellAmount, sell.decimals)
  const promisedContracts = promisedContractsMap
  const { symbol: sellName } = getTokenName(sell)

  try {
    // don't do anything when submitting a <= 0 amount
    if (+sellAmount <= 0) throw new Error('Invalid selling amount. Cannot sell 0.')

    // SELLTOKEN APPROVAL
    if (tokenType === 'SELLTOKEN') {
      if (choice === 'MIN') {
        dispatch(openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `Approving token transfer for this trade only`,
            body: `You are approving ${sellAmount} ${sellName}. Please confirm with ${activeProvider || 'your wallet provider'}.`,
            loader: true,
          },
        }))
        const nativeSellAmt = await promisedNativeSellAmt

        console.log('PROMPTING to start tokenApproval tx for MIN', sellName)
        const tokenApprovalHash = await tokenApproval.sendTransaction(sell.address, nativeSellAmt.toString())
        console.log('tokenApproval tx hash', tokenApprovalHash)
      } else {
        dispatch(openModal({
          modalName: 'TransactionModal',
          modalProps: {
            header: `Approving token transfer also for future trades`,
            body: `You will no longer need to sign two transactions for future orders with ${sellName} and will save transaction costs. Please confirm with ${activeProvider || 'your wallet provider'}.`,
            loader: true,
          },
        }))
        // CONSIDER/TODO: move allowanceLeft into state
        const allowanceLeft = (await getTokenAllowance(sell.address, currentAccount)).toNumber()

        console.log('PROMPTING to start tokenApproval tx for MAX', sellName)
        const tokenApprovalHash = await tokenApproval.sendTransaction(sell.address, ((2 ** 255) - allowanceLeft).toString())
        console.log('tokenApproval tx hash', tokenApprovalHash)
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

        console.log('PROMPTING to start tokenApproval tx for OWL')
        const tokenApprovalHash = await tokenApproval.sendTransaction(TokenOWL.address, ((2 ** 255) - allowanceLeft).toString())
        console.log('tokenApproval for OWL tx hash', tokenApprovalHash)
      } else {
        console.log('Disallowing OWL')
        dispatch(closeModal())
      }
    }
  } catch (error) {
    throw error
  }
}

export const withdrawFromDutchX = ({ name, address }: { name: string, address: string }) => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { blockchain: { activeProvider } } = getState(),
    { DutchExchange } = contractsMap,
    decoder = getDecoderForABI(DutchExchange.abi)
  try {
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Withdrawing Funds`,
        body: `You are withdrawing ${name} from the DutchX to your wallet. Please confirm with ${activeProvider || 'your wallet provider'}.`,
        loader: true,
      },
    }))

    // await withdraw(address)

    const withdrawHash = await withdraw.sendTransaction(address)
    // get receipt or throw TIMEOUT
    const withdrawReceipt = await Promise.race([waitForTx(withdrawHash), timeoutCondition(120000, 'TIMEOUT')]).catch(() => { throw new Error('SAFETY NETWORK TIMEOUT - PLEASE REFRESH YOUR PAGE') })
    console.log('Withdraw TX receipt: ', withdrawReceipt)

    // next line unreachable in case of TIMEOUT
    // @ts-ignore
    const withdrawLogs = decoder(withdrawReceipt.logs)
    console.log('withdraw tx logs', withdrawLogs)

    // Find the 'NewWithdrawal' log
    let withdrawEvents
    // loop until sellBalance drops to 0
    while (!withdrawEvents) {
      withdrawEvents = withdrawLogs.find((log: Web3EventLog) => log._eventName === 'NewWithdrawal')
    }

    return dispatch(closeModal())
  } catch (error) {
    dispatch(errorHandling(error))
  }
}

export const claimSellerFundsAndWithdrawFromAuction = (
  pair: TokenPair,
  index: number,
  amount: BigNumber,
  account: Account,
) => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { sell, buy } = pair
  const { blockchain: { activeProvider } } = getState(),
    sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address,
    buyName = buy.symbol.toUpperCase() || buy.name.toUpperCase() || buy.address
  try {
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Claiming Funds`,
        body: `You are claiming ${buyName} from this ${sellName}-${buyName} auction to your wallet. Please confirm with ${activeProvider}`,
        loader: true,
      },
    }))
    const claimAndWithdrawReceipt = await claimSellerFundsAndWithdraw(pair, index, amount, account)
    console.log('​ClaimAndWithdraw receipt => ', claimAndWithdrawReceipt)

    // refresh state ...
    let sellerBalance: BigNumber = await dispatch(updateMainAppState({ fn: getSellerBalance, args: [pair, index, account] }))
    // loop until sellBalance drops to 0
    while (sellerBalance.gt(0)) {
      (sellerBalance = await dispatch(updateMainAppState({ fn: getSellerBalance, args: [pair, index, account] })))
    }

    return dispatch(closeModal())
  } catch (error) {
    console.error(error.message)

    dispatch(errorHandling(error, false))
  }
}

export const claimSellerFundsFromSeveral = (
  sell: DefaultTokenObject,
  buy: DefaultTokenObject,
  lastNIndex?: number,
) => async (dispatch: Dispatch<any>, getState: () => State) => {
  const { blockchain: { activeProvider, currentAccount } } = getState(),
    sellName = sell.symbol.toUpperCase() || sell.name.toUpperCase() || sell.address,
    buyName = buy.symbol.toUpperCase() || buy.name.toUpperCase() || buy.address,
    { DutchExchange } = contractsMap

  let decoder

  try {
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Claiming funds`,
        body: `You are claiming ${buyName} from all your unclaimed ${sellName}/${buyName} auctions. Please confirm with ${activeProvider || 'your wallet provider'}.`,
        loader: true,
      },
    }))

    // >>> ============= >>>
    // CLAIMING TX WATCHING
    // >>> ============= >>>

    const claimHash = await claimSellerFundsFromSeveralAuctions.sendTransaction(sell, buy, currentAccount, lastNIndex)
    console.log('ClaimSellerFundsFromSeveralAuctions TX HASH: ', claimHash)

    // >>> ============= >>>
    // END CLAIMING TX
    // >>> ============= >>>

    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Withdrawing Claimed Funds`,
        body: `You are withdrawing ${buyName} from the DutchX to your wallet. Please confirm with ${activeProvider || 'your wallet provider'}.`,
        loader: true,
      },
    }))

    // >>> ======== >>>
    // WITHDRAW TX WATCHING
    // >>> ======== >>>

    // wait claimHash
    await waitForTx(claimHash)

    const withdrawHash = await withdraw.sendTransaction(buy.address)
    // get receipt or throw TIMEOUT
    const withdrawReceipt = await Promise.race([waitForTx(withdrawHash), timeoutCondition(120000, 'TIMEOUT')]).catch(() => { throw new Error('SAFETY NETWORK TIMEOUT - PLEASE REFRESH YOUR PAGE') })
    console.log('Withdraw TX receipt: ', withdrawReceipt)

    decoder = getDecoderForABI(DutchExchange.abi)
    // next line unreachable in case of TIMEOUT
    // @ts-ignore
    const withdrawLogs = decoder(withdrawReceipt.logs)
    console.log('withdraw tx logs', withdrawLogs)

    // Find the 'NewWithdrawal' log
    let withdrawEvents
    // loop until sellBalance drops to 0
    while (!withdrawEvents) {
      withdrawEvents = withdrawLogs.find((log: Web3EventLog) => log._eventName === 'NewWithdrawal')
    }

    console.log('>>=====> NEW_WITHDRAWAL_EVENT >>====> ', withdrawEvents)

    // >>> ======== >>>
    // END WITHDRAW TX WATCHING
    // >>> ======== >>>

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
  { address, isETH }: DefaultTokenObject,
  weiSellAmount: BigNumber,
  account?: Account,
): Promise<boolean | BigNumber> {
  // BYPASS[return false] => if token is not ETHER
  console.log('address: ', address)
  console.log('isETH: ', isETH)
  if (!isETH) return false
  // CONSIDER/TODO: wrappedETH in state or TokenBalance
  const wrappedETH = await getEtherTokenBalance(account)
  console.log('wrappedETH: ', wrappedETH)
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

export function errorHandling(error: Error, goHome = true) {
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

    // reset sellAmount
    dispatch(setSellTokenAmount({ sellAmount: '0' }))

    // go home stacy
    if (goHome) dispatch(push('/'))
    dispatch(openModal({
      modalName: 'TransactionModal',
      modalProps: {
        header: `Transaction failed / was cancelled`,
        body: `${activeProvider || 'Your provider'} has cancelled your transaction. Please see below for more information:`,
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
