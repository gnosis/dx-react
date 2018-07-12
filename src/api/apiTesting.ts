import { promisedContractsMap } from 'api/contracts'

import { DefaultTokens } from 'api/types'
import { ETH_ADDRESS } from 'globals'

export default async () => {
  const {
    TokenETH,
    TokenGNO,
    TokenMGN,
    // TokenOMG,
    // TokenRDN,
  } = await promisedContractsMap

  // TODO: hard-code actual addresses here
  return {
    elements: [
      {
        name: 'ETHER',
        symbol: 'ETH',
        address: ETH_ADDRESS,
        isETH: true,
        decimals: 18,
      },
      {
        name: 'WRAPPED ETHER',
        symbol: 'WETH',
        address: TokenETH.address,
        decimals: (await TokenETH.decimals()).toNumber(),
      },
      {
        name: 'GNOSIS TOKEN',
        symbol: 'GNO',
        address: TokenGNO.address,
        decimals: (await TokenGNO.decimals()).toNumber(),
      },
      {
        name: 'MAGNOLIA',
        symbol: 'MGN',
        address: TokenMGN.address,
        decimals: 18,
      },
      // {
      //   name: 'OMISEGO',
      //   symbol: 'OMG',
      //   address: TokenOMG.address,
      //   decimals: TokenOMG.decimals ? (await TokenOMG.decimals()).toNumber() : 12,
      // },
      // {
      //   name: 'RAIDEN',
      //   symbol: 'RDN',
      //   address: TokenRDN.address,
      //   decimals: TokenRDN.decimals ? (await TokenRDN.decimals()).toNumber() : 6,
      // },
    ],
    page: 1,
    hasMorePages: false,
  } as DefaultTokens
}
