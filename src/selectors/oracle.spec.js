import { getOracleByAddress } from './oracle'

describe('oracleSelector', () => {
  describe('getOracleByAddress', () => {
    test('it should return a valid oracle entity', () => {
      const state = {
        entities: {
          oracles: {
            test123: {
              address: 'test123',
              event: 'test123',
            },
          },
        },
      }

      expect(getOracleByAddress(state)('test123')).toMatchObject(state.entities.oracles.test123)
    })

    test('it should return undefined for an invalid address', () => {
      const state = {
        entities: {
          oracles: {
            test123: {
              address: 'test123',
              event: 'test123',
            },
          },
        },
      }

      expect(getOracleByAddress(state)('noOracle')).toBeUndefined()
    })
  })
})
