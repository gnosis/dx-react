export const composeMarket = () => async () => ({
  entities: {
    eventDescriptions: {
      QmQQAUVuePKbQhinzbYikuGxf6TpFTzcr6VzMupii6Brvp: {
        description: 'Or will it be an actual market?!',
        title: 'Will this be a test market?',
        outcomes: ['Yes', 'No'],
        resolutionDate: '2021-12-12T09:00:00+01:00',
        ipfsHash: 'QmQQAUVuePKbQhinzbYikuGxf6TpFTzcr6VzMupii6Brvp',
      },
    },
    oracles: {
      '332280007303d5942dd60a945169b2b303320686': {
        oracleType: 'CENTRALIZED',
        ipfsHash: 'QmQQAUVuePKbQhinzbYikuGxf6TpFTzcr6VzMupii6Brvp',
        address: '332280007303d5942dd60a945169b2b303320686',
        isOutcomeSet: false,
        outcome: null,
        eventDescription: 'QmQQAUVuePKbQhinzbYikuGxf6TpFTzcr6VzMupii6Brvp',
      },
    },
    events: {
      '79183957be84c0f4da451e534d5ba5ba3fb9c696': {
        outcomeCount: 2,
        outcomeType: 'CATEGORICAL',
        oracle: '332280007303d5942dd60a945169b2b303320686',
        address: '79183957be84c0f4da451e534d5ba5ba3fb9c696',
      },
    },
    markets: {
      f68f5498dd766a8d65c4785219d61fcc5e0e920a: {
        funding: 2,
        fee: 1.11,
        marketMaker: '59d3631c86bbe35ef041872d502f218a39fba150',
        marketFactory: '290fb167208af455bb137780163b7b7a9a10c16',
        event: '79183957be84c0f4da451e534d5ba5ba3fb9c696',
        creationDate: '2017-07-11T13:03:37.666Z',
      },
    },
  },
})
