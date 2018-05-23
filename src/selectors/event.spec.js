import { getEventByAddress } from './event'

describe('eventSelector', () => {
  describe('getEventByAddress', () => {
    test('it should return undefined for an invalid address', () => {
      const state = {
        entities: {},
      }

      expect(getEventByAddress(state)('test123')).toBeUndefined()
    })

    test('it should return event structure for valid address', () => {
      const state = {
        entities: {
          events: {
            test123: {
              id: 'test123',
            },
          },
        },
      }

      const desired = {
        id: 'test123',
      }

      expect(getEventByAddress(state)('test123')).toMatchObject(desired)
    })
  })
})
