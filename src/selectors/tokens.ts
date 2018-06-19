import { DefaultTokenObject } from 'types'
import { ETH_ADDRESS } from 'globals'

export const getTokenName = ({ symbol, name, address }: DefaultTokenObject) => {
  if (address === ETH_ADDRESS) return 'WETH'
  return symbol && symbol.toUpperCase() || name && name.toUpperCase() || address
}
