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
  selectTokenPair,
  setApprovedTokens,
  setTokenListType,
} from 'actions'

import { promisedIPFS } from 'api/IPFS'
import { checkTokenListJSON } from 'api/utils'
import { getAllTokenDecimals, getApprovedTokensFromAllTokens } from 'api'

import { DefaultTokens, DefaultTokenObject } from 'api/types'
import tokensMap from 'api/apiTesting'

import { TokenPair, State } from 'types'
import { ConnectedInterface } from './types'

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

  const getTokenList = async () => {
    let [defaultTokens, customTokens, customListHash] = await Promise.all<DefaultTokens, DefaultTokens['elements'], string>([
      localForage.getItem('defaultTokens'),
      localForage.getItem('customTokens'),
      localForage.getItem('customListHash'),
    ])
    const { ipfsFetchFromHash } = await promisedIPFS
    const isDefaultTokensAvailable = !!(defaultTokens)

    if (!isDefaultTokensAvailable) {
      // grab tokens from IPFSHash or api/apiTesting depending on NODE_ENV
      if (process.env.NODE_ENV !== 'production') {
        defaultTokens = await tokensMap()
      } else {
        // TODO: change for prod
        defaultTokens = await ipfsFetchFromHash('QmXgUiWTumXghNuLk3vAypVeL4ycVkNKhrtWfvFHoQTJAM') as DefaultTokens
      }
      
      console.log('​getTokenList -> ', defaultTokens)
      // set tokens to localForage
      await localForage.setItem('defaultTokens', defaultTokens)
    }

    const defaultSell = defaultTokens.elements.find(tok => tok.symbol === 'ETH')

    // IPFS hash for tokens exists in localForage
    if (customListHash) dispatch(setIPFSFileHashAndPath({ fileHash: customListHash }))

    if (customTokens) {
      const customTokensWithDecimals = await getAllTokenDecimals(customTokens)

      // reset localForage customTokens w/decimals filled in
      localForage.setItem('customTokens', customTokensWithDecimals)
      dispatch(setCustomTokenList({ customTokenList: customTokensWithDecimals }))
      dispatch(setTokenListType({ type: 'CUSTOM' }))
    } else if (customListHash) {
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
    dispatch(selectTokenPair({ buy: undefined, sell: defaultSell } as TokenPair))

    return getState().tokenList
  }

  try {
    const { combinedTokenList } = await getTokenList()

    // TODO: fetch approvedTokens list from api
    // then after getting tokensJSON in getDefaultTokens create a list of approved TokenCodes
    // then only dispatch that list
    // const [ETH, GNO] = defaultTokenList
    // dispatch(setApprovedTokens([ETH.address, GNO.address]))

    const approvedTokenAddresses = await getApprovedTokensFromAllTokens(combinedTokenList)
    dispatch(setApprovedTokens(approvedTokenAddresses))

    await initialize(providerOptions)
  } catch (error) {
    console.warn('Error in walletIntegrations: ', error.message || error)
  } finally {
    return dispatch(initDutchX())
  }
}
