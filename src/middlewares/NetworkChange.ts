import { Middleware, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { State } from 'types'
import { Dispatch } from 'react-redux'

// import localForage from 'localforage'
import { code2Network } from 'utils/helpers'

// const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

const NetworkChange: Middleware = ({ getState }: { dispatch: Dispatch<any>, getState: any }) => next => async (action: Action | ThunkAction<Action, Partial<State>, void>) => {
  const { type } = action as Action

  if (type !== 'UPDATE_PROVIDER') return next(action as Action)

  // @ts-ignore
  const { network: payloadNetwork } = action.payload
  const { activeProvider/* , connected */ } = getState().blockchain
  const { network } = getState().blockchain.providers[activeProvider]

  if (network === payloadNetwork || payloadNetwork === code2Network(window.web3.version.network)) return next(action as Action)

  try {
    // delete defaultTokenList
    // MetaMask refreshes...
    // await localForage.removeItem('defaultTokens')
    return next(action as Action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
  }
}

export default NetworkChange
