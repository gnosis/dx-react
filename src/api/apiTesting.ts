import { promisedContractsMap } from 'api/contracts'

import { DefaultTokens } from 'api/types'

export default async () => {
  const {
    TokenETH,
    TokenGNO,
    TokenOWL,
    TokenMGN,
    // TokenOMG,
    // TokenRDN,
  } = await promisedContractsMap

  // TODO: grab from IPFS defaultObj or uploaded file, or localStorage?
  return {
    elements: [
      {
        name: 'ETHER',
        symbol: 'ETH',
        address: TokenETH.address,
        decimals: (await TokenETH.decimals()).toNumber(),
      },
      {
        name: 'GNOSIS',
        symbol: 'GNO',
        address: TokenGNO.address,
        decimals: (await TokenGNO.decimals()).toNumber(),
      },
      {
        name: 'OWL',
        symbol: 'OWL',
        address: TokenOWL.address,
        decimals: (await TokenOWL.decimals()).toNumber(),
      },
      {
        name: 'MAGNOLIA',
        symbol: 'MGN',
        address: TokenMGN.address,
        decimals: TokenMGN.decimals ? (await TokenMGN.decimals()).toNumber() : 18,
      },
      // {
      //   name: 'OMISEGO',
      //   symbol: 'OMG',
      //   address: TokenOMG.address,
      // decimals: TokenOMG.decimals(),
      // },
      // {
      //   name: 'RAIDEN',
      //   symbol: 'RDN',
      //   address: TokenRDN.address
      //   decimals: TokenRDN.decimals(),
      // },
    ],
    page: 1,
    hasMorePages: false,
  } as DefaultTokens
}
