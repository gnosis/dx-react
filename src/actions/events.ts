import { createAction, handleActions } from 'redux-actions'
import { Dispatch } from 'redux'
import { State } from 'types'

import Web3 from 'web3'
import { RINKEBY_WEBSOCKET } from 'globals'
import { contractsMap, HumanFriendlyToken } from 'api/contracts'

export const saveEvent = createAction<{ eventType: string, event: any }>('SAVE_EVENT')
export const saveLogs = createAction<{ log: any }>('SAVE_LOG')
export const saveTransaction = createAction<{ txName: string, txHash: any }>('SAVE_TRANSACTION')
export const removeTransaction = createAction<{ txHash: string }>('REMOVE_TRANSACTION')

export const setupContractEventListening = () => async (dispatch: Dispatch<any>, getState: () => State) => {
  console.log('​exportsetupContractEventListening -> ')

  const { tokenList: { combinedTokenList } } = getState()

  const WSweb3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_WEBSOCKET))
  const { DutchExchange } = contractsMap

  const defaultCB = (e: Error) => {
    if (e) throw (e)
  }

  const createFilter = (type: string, options: any = [defaultCB]) => WSweb3.eth.subscribe(type, ...options)

  // New Data filter
  createFilter('newBlockHeaders', [defaultCB]).on('data', (log: any) => {
    console.log('Block update:', log)
    dispatch(saveLogs({ log }))
  })

  // Logs Filter
  // createFilter('logs', [{ fromBlock: 'latest', address: '0xc778417e063141139fce010982780140aa0cd5ab' }, defaultCB])
  //   .on('data', (log: any) => {
  //     console.log('logs', log)
  //   })
  //   .on('confirmation', (res: any) => console.log('CONFIRMATION CONFIRMATION', res))

  // listen to DX events

  const DX = new WSweb3.eth.Contract(DutchExchange.abi, '0x2ade4c3d9fd649ff6e97dcb50b684984bc8f6375')

  DX.events.allEvents({ fromBlock: 'latest' }, (err: Error) => {
    if (err) console.error(err)
  })
  .on('data', (event: any) => {
    console.log(event)
    // dispatch event here
    dispatch(saveEvent({ eventType: 'DX_Events', event }))
  })
  .on('error', (err: Error) => console.error(err))

  combinedTokenList.forEach((token: any) => {
    if (token.address === '0x0') return
    const Token = new WSweb3.eth.Contract(HumanFriendlyToken.abi, token.address)

    Token.events.allEvents({ fromBlock: 'latest' }, (err: Error) => { if (err) console.error(err) })
    .on('data', (event: any) => {
      console.log(`>>==> ${token.symbol || token.name} TOKEN EVENT: `, event)
      // dispatch event here
      dispatch(saveEvent({ eventType: 'TOKEN_Events', event }))
    })
    .on('error', (err: Error) => console.error(err))
  })
}

export const reducer = handleActions({
  [saveEvent.toString()]: (state, action) => {
    // @ts-ignore
    const { eventType, event } = action.payload
    return {
      ...state,
      events: {
        ...state.events,
        [eventType]: [...state.events[eventType], event],
      },
      transactionsPending: state.transactionsPending.filter((tx: any) => tx.txHash !== event.transactionHash),
    }
  },
  [saveLogs.toString()]: (state, action) => ({
    ...state,
    logs: {
        all: state.logs.all.length <= 10 ? [...state.logs.all, action.payload] : [action.payload],
      },
  }),
  [saveTransaction.toString()]: (state, action) => ({
    ...state,
    transactionsPending: [...state.transactionsPending, action.payload],
  }),
  [removeTransaction.toString()]: (state, action: any) => ({
    ...state,
    transactionsPending: state.transactionsPending.filter((tx: any) => tx.txHash !== action.payload.txHash),
  }),
},
  {
    events: {
      DX_Events: [],
      TOKEN_Events: [],
    },
    logs: {
      all: [],
    },
    transactionsPending: [],
  })
