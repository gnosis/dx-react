import { getMarkets, getMarketById, getMarketSharesByMarket } from './market'

describe('marketSelector', () => {
  describe('getMarketById', () => {
    test('it should return an empty object for invalid address', () => {
      const state = {
        entities: {
          foo: { address: 'not to be included' },
        },
      }

      expect(getMarketById(state)('test123')).toMatchObject({})
    })

    test('it should return a market with an event, oracle and eventdescription', () => {
      const state = {
        entities: {
          markets: {
            test123: {
              address: 'test123',
              event: 'event1',
            },
          },
          events: {
            event1: {
              address: 'event1',
              oracle: 'oracle1',
              type: 'CATEGORICAL',
            },
          },
          oracles: {
            oracle1: {
              address: 'oracle1',
              eventDescription: 'eventDescription1',
              type: 'CENTRALIZED',
            },
          },
          eventDescriptions: {
            eventDescription1: {
              title: 'müll',
            },
          },
        },
      }

      expect(getMarketById(state)('test123')).toHaveProperty('address')
      expect(getMarketById(state)('test123')).toHaveProperty('event.address', 'event1')
      expect(getMarketById(state)('test123')).toHaveProperty('event.type', 'CATEGORICAL')
      expect(getMarketById(state)('test123')).toHaveProperty('oracle.address', 'oracle1')
      expect(getMarketById(state)('test123')).toHaveProperty('oracle.type', 'CENTRALIZED')
      expect(getMarketById(state)('test123')).toHaveProperty('eventDescription.title', 'müll')
    })
  })

  describe('getMarkets', () => {
    test('it should return an empty array for invalid address', () => {
      const state = {
        entities: {},
      }

      expect(getMarkets(state)).toEqual([])
    })
  })

  describe('getMarketSharesByMarket', () => {
    test('it should return an empty array for invalid market', () => {
      const state = {
        entities: {},
      }

      expect(getMarketSharesByMarket(state)('test123')).toEqual([])
    })

    test('it should return the shares for a market', () => {
      const state = {
        entities: {
          markets: {
            testmarket123: {
              address: 'testmarket123',
              event: 'event1',
              shares: ['share1', 'share2'],
            },
          },
          events: {
            event1: {
              address: 'event1',
              oracle: 'oracle1',
              type: 'CATEGORICAL',
            },
          },
          oracles: {
            oracle1: {
              address: 'oracle1',
              eventDescription: 'eventDescription1',
              type: 'CENTRALIZED',
            },
          },
          eventDescriptions: {
            eventDescription1: {
              title: 'müll',
            },
          },
          marketShares: {
            share1: {
              id: 'share1',
              event: 'testevent123',
              owner: 'testuser123',
              balance: 1e18,
            },
            share2: {
              id: 'share2',
              event: 'testevent123',
              owner: 'testuser123',
              balance: 1e18,
            },
          },
        },
      }

      expect(getMarketSharesByMarket(state)('testmarket123')).toMatchObject([
        {
          id: 'share1',
          event: 'testevent123',
          owner: 'testuser123',
          balance: 1e18,
        },
        {
          id: 'share2',
          event: 'testevent123',
          owner: 'testuser123',
          balance: 1e18,
        },
      ])
    })
  })
})
