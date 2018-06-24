import { DefaultTokenObject, State } from 'types'
import { ETH_ADDRESS } from 'globals'
import { toBigNumber } from 'web3/lib/utils/utils.js'
import { EMPTY_TOKEN } from 'globals'

export const getTokenName = ({ symbol, name, address, isETH }: DefaultTokenObject) => {
  if (address === ETH_ADDRESS && isETH) return 'WETH'
  return symbol && symbol.toUpperCase() || name && name.toUpperCase() || address
}

export const getSellTokenBalance = ({ tokenPair: { sell = EMPTY_TOKEN }, tokenBalances }: State) => {
  const { [sell.address]: sellTokenBalance } = tokenBalances
  return sellTokenBalance === undefined ? toBigNumber(0) : sellTokenBalance
}

export const getBuyTokenBalance = ({ tokenPair: { buy = EMPTY_TOKEN }, tokenBalances }: State) => {
  const { [buy.address]: buyTokenBalance } = tokenBalances
  return buyTokenBalance === undefined ? toBigNumber(0) : buyTokenBalance
}