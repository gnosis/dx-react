import { createAction, handleActions } from 'redux-actions'

export const saveDXEvent = createAction<{ event: any }>('SAVE_DX_EVENT')
export const saveLogs = createAction<{ log: any }>('SAVE_LOG')
export const saveTransaction = createAction<{ txName: string, txHash: any }>('SAVE_TRANSACTION')
export const removeTransaction = createAction<{ txHash: string }>('REMOVE_TRANSACTION')

export const reducer = handleActions({
  [saveDXEvent.toString()]: (state, action) => ({
      ...state,
      events: {
          DX_Events: [...state.events.DX_Events, action.payload],
        },
    }),
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
    },
    logs: {
      all: [],
    },
    transactionsPending: [],
  })
