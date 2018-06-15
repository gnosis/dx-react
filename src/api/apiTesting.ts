import { promisedContractsMap } from 'api/contracts'

import { DefaultTokens } from 'api/types'
import { promisedWeb3 } from './web3Provider'

export default async () => {
  const {
    TokenETH,
    TokenOMG,
    TokenRDN,
  } = await promisedContractsMap
  const { getCurrentAccount } = await promisedWeb3

  // TODO: hard-code actual addresses here
  return {
    elements: [
      {
        name: 'ETHER',
        symbol: 'ETH',
        address: await getCurrentAccount(),
        decimals: 18,
      },
      {
        name: 'WRAPPED ETHER',
        symbol: 'WETH',
        address: TokenETH.address,
        decimals: (await TokenETH.decimals()).toNumber(),
      },
      {
        name: 'OMISEGO',
        symbol: 'OMG',
        address: TokenOMG.address,
        decimals: TokenOMG.decimals ? (await TokenOMG.decimals()).toNumber() : 12,
      },
      {
        name: 'RAIDEN',
        symbol: 'RDN',
        address: TokenRDN.address,
        decimals: TokenRDN.decimals ? (await TokenRDN.decimals()).toNumber() : 6,
      },
    ],
    page: 1,
    hasMorePages: false,
  } as DefaultTokens
}
