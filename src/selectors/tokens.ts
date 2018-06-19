import { DefaultTokenObject } from 'types'
import { ETH_ADDRESS } from 'globals'

export const getTokenName = ({ symbol, name, address, isETH }: DefaultTokenObject) => {
  if (address === ETH_ADDRESS && isETH) return 'WETH'
  return symbol && symbol.toUpperCase() || name && name.toUpperCase() || address
}
