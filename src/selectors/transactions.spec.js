import { transactionSelector } from 'selectors/transactions'

// import { TRANSACTION_STATUS, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

describe('transactionsSelector', () => {
  test('it should return a transaction object', () => {
    const state = {
      transactions: {
        log: {
          test123: {
            id: 'test123',
          },
        },
      },
    }

    expect(transactionSelector(state, 'test123')).toMatchObject(state.transactions.log.test123)
  })

  test('it should return an empty object for an invalid transaction id', () => {
    const state = {
      transactions: {
        log: {
          test123: {
            id: 'test123',
          },
        },
      },
    }

    expect(transactionSelector(state, 'test123')).toMatchObject({})
  })
})
