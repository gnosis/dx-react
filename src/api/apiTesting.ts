import { promisedContractsMap } from 'api/contracts';

import { DefaultTokens } from 'api/types';

export default async () => {
  const { TokenETH, TokenGNO, TokenOWL, TokenMGN, TokenOMG, TokenRDN } = await promisedContractsMap

  // TODO: grab from IPFS defaultObj or uploaded file, or localStorage?
  return {
    elements: [
      {
        name: 'ETHER',
        symbol: 'ETH',
        address: TokenETH.address
      },
      {
        name: 'GNOSIS',
        symbol: 'GNO',
        address: TokenGNO.address
      },
      {
        name: 'OWL',
        symbol: 'OWL',
        address: TokenOWL.address
      },
      {
        name: 'MAGNOLIA',
        symbol: 'MGN',
        address: TokenMGN.address
      },
      {
        name: 'OMISEGO',
        symbol: 'OMG',
        address: TokenOMG.address
      },
      {
        name: 'RAIDEN',
        symbol: 'RDN',
        address: TokenRDN.address
      },
    ],
    page: 1,
    hasMorePages: false
  } as DefaultTokens
}