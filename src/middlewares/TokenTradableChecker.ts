import { Middleware, Action } from 'redux'
import { TRADE_BLOCKED_TOKENS } from 'tokens'

const TokenTradableChecker = () => (next: Function) => async (action: any) => {
  const { payload, type }: any = action as Action
  if (type !== 'SET_AVAILABLE_AUCTIONS' || TRADE_BLOCKED_TOKENS.noBlock) return next(action as Action)

  try {
    const { web3CompatibleNetwork } = require('../utils')
    const promisedNetwork = web3CompatibleNetwork()

    const tokensToBlockArr = Object.values(TRADE_BLOCKED_TOKENS[await promisedNetwork])

    const newPayload = payload.reduce((acc: any, tokenPair: any) => {
      let blocked: boolean

        // forEach '0x123-0xabc' loop through => MAIN: ['0x567', '0xabc', ...]
      tokensToBlockArr.forEach((address: string) => {
        if (tokenPair.includes(address)) blocked = true
      })

      if (blocked) return acc

      acc.push(tokenPair)
      return acc
    }, [])

    const newAction = { type, payload: newPayload }

    return next(newAction as Action)
  } catch (e) {
    // Unable to load or parse stored state, proceed as usual
    console.debug(e)
  }
}

export default TokenTradableChecker as Middleware
