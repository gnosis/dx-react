import localForage from 'localforage'
import { Store, Dispatch } from 'redux'

import initialize from './initialize'

import {
  registerProvider,
  updateProvider,
  initDutchX,
  updateMainAppState,
  resetMainAppState,
  setDefaultTokenList,
  setCustomTokenList,
  setIPFSFileHashAndPath,
  setApprovedTokens,
  setAvailableAuctions,
  setTokenListType,
} from 'actions'

import { promisedIPFS } from 'api/IPFS'
import { checkTokenListJSON } from 'api/utils'
import { getAllTokenDecimals, getApprovedTokensFromAllTokens, getAvailableAuctionsFromAllTokens } from 'api'

import { DefaultTokens, DefaultTokenObject } from 'api/types'
import tokensMap from 'api/apiTesting'

import { State } from 'types'
import { ConnectedInterface } from './types'
import { ETHEREUM_NETWORKS } from './constants'
// import { IPFS_TOKENS_HASH } from 'globals'

export const getTokenList = (network?: string) => async (dispatch: Dispatch<any>, getState: () => State) => {

  let [defaultTokens, customTokens, customListHash] = await Promise.all<DefaultTokens, DefaultTokens['elements'], string>([
    localForage.getItem('defaultTokens'),
    localForage.getItem('customTokens'),
    localForage.getItem('customListHash'),
  ])
  const { ipfsFetchFromHash } = await promisedIPFS
  const isDefaultTokensAvailable = !!(defaultTokens)

  if (!isDefaultTokensAvailable) {
    network = network || window.web3.version.network

    console.log('Current Network =', network)

    // grab tokens from IPFSHash or api/apiTesting depending on NODE_ENV
    /* if (process.env.NODE_ENV === 'development') {
      defaultTokens = await ipfsFetchFromHash(IPFS_TOKENS_HASH) as DefaultTokens
    } else {
      // TODO: change for prod
      defaultTokens = await ipfsFetchFromHash(IPFS_TOKENS_HASH) as DefaultTokens
    } */

    switch (network) {
      case '4' || ETHEREUM_NETWORKS.RINKEBY:
        console.log(`Detected connection to ${ETHEREUM_NETWORKS.RINKEBY}`)
        defaultTokens = require('../../test/resources/token-lists/RINKEBY/token-list.js')
        console.log('Rinkeby Token List -> ', defaultTokens.elements)
        break

      case '1' || ETHEREUM_NETWORKS.MAIN:
        console.log(`Detected connection to ${ETHEREUM_NETWORKS.MAIN}`)
        // TODO: fix for Mainnet
        defaultTokens = require('../../test/resources/token-lists/MAIN/token-list.js')
        console.warn(`
          Ethereum Mainnet not supported - please try another network.
          Removing tokens from localForage ...
          ${defaultTokens.elements}
        `)
        break

      default:
        console.log(`Detected connection to an UNKNOWN network -- localhost?`)
        defaultTokens = await tokensMap()
        console.log('LocalHost Token List -> ', defaultTokens.elements)
        break
    }

    // set tokens to localForage
    await localForage.setItem('defaultTokens', defaultTokens)
  }

  // IPFS hash for tokens exists in localForage
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
  dispatch(setDefaultTokenList({ defaultTokenList: defaultTokens.elements }))

  return getState().tokenList
}

export default async function walletIntegration(store: Store<any>) {
  const { dispatch, getState }: { dispatch: Dispatch<any>, getState: () => State } = store
  // wraps actionCreator in dispatch
  const dispatchProviderAction = (actionCreator: any) =>
    async (provider: any, data: any) => dispatch(actionCreator({
      provider,
      ...data,
    }))

  const providerOptions: ConnectedInterface = {
    getState,
    updateProvider: dispatchProviderAction(updateProvider),
    registerProvider: dispatchProviderAction(registerProvider),
    updateMainAppState: dispatchProviderAction(updateMainAppState),
    resetMainAppState: () => dispatch(resetMainAppState()),
  }

  try {
    // init Provider first - set a watcher for 6000 ms to check changes
    initialize(providerOptions)

    const { combinedTokenList } = await dispatch(getTokenList())

    // TODO: fetch approvedTokens list from api
    // then after getting tokensJSON in getDefaultTokens create a list of approved TokenCodes
    // then only dispatch that list
    // const [ETH, GNO] = defaultTokenList
    // dispatch(setApprovedTokens([ETH.address, GNO.address]))

    const [approvedTokenAddresses, availableAuctions] = await Promise.all([
      getApprovedTokensFromAllTokens(combinedTokenList),
      getAvailableAuctionsFromAllTokens(combinedTokenList),
    ])
    dispatch(setApprovedTokens(approvedTokenAddresses))
    dispatch(setAvailableAuctions(availableAuctions))

  } catch (error) {
    console.warn('Error in walletIntegrations: ', error.message || error)
  } finally {
    return dispatch(initDutchX())
  }
}
