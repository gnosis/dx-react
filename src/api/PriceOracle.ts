import { promisedContractsMap } from './contracts'
import { PriceOracle } from './types'

let priceOracle: PriceOracle

export const promisedPriceOracle = async () => priceOracle || (priceOracle = await init())

async function init(): Promise<PriceOracle> {
  const { PriceOracleInterface: po } = await promisedContractsMap()

  const getUSDETHPrice = () => po.getUSDETHPrice.call()

  return {
    get address() {
      return po.address
    },
    getUSDETHPrice,
  }
}
