import { getEventDescriptionByAddress } from './eventDescription'

describe('eventDescriptionSelector', () => {
  describe('getEventDescriptionByAddress', () => {
    test('it should return undefined for an invalid address', () => {
      const state = {
        entities: {},
      }

      expect(getEventDescriptionByAddress(state)('test123')).toBeUndefined()
    })

    test('it should return event structure for valid address', () => {
      const state = {
        entities: {
          eventDescriptions: {
            test123: {
              id: 'test123',
              title: 'Hello!',
              description: 'Lorem Ipsum!',
              ipfsHash: 'test123',
            },
          },
        },
      }

      const desired = {
        id: 'test123',
        title: 'Hello!',
        description: 'Lorem Ipsum!',
        ipfsHash: 'test123',
      }

      expect(getEventDescriptionByAddress(state)('test123')).toMatchObject(desired)
    })
  })
})
