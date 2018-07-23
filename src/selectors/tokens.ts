import { DefaultTokenObject, State } from 'types'
import { ETH_ADDRESS, EMPTY_TOKEN } from 'globals'
import { toBN as toBigNumber } from 'web3-utils'

export const getTokenName = ({ symbol, name, address, isETH }: DefaultTokenObject) => {
  if (address === ETH_ADDRESS && isETH) return { symbol: 'WETH', name: 'Wrapped-Ether' }
  return {
    name: name && name.toUpperCase() || symbol && symbol.toUpperCase() || address,
    symbol: symbol && symbol.toUpperCase() || name && name.toUpperCase() || address,
  }
}

export const getSellTokenBalance = ({ tokenPair: { sell = EMPTY_TOKEN }, tokenBalances }: State) => {
  const { [sell.address]: sellTokenBalance } = tokenBalances
  return sellTokenBalance === undefined ? toBigNumber(0) : sellTokenBalance
}

export const getBuyTokenBalance = ({ tokenPair: { buy = EMPTY_TOKEN }, tokenBalances }: State) => {
  const { [buy.address]: buyTokenBalance } = tokenBalances
  return buyTokenBalance === undefined ? toBigNumber(0) : buyTokenBalance
}
