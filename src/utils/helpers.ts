import { WALLET_PROVIDER } from 'integrations/constants'
import Decimal from 'decimal.js'
const Web3 = require('web3')

export const getDutchXOptions = (provider: any) => {
  console.log('FIRING getDutchXOptions')
  const opts: any = {}

  if (provider && provider.name === WALLET_PROVIDER.METAMASK) {
      // Inject window.web3
    opts.ethereum = window.web3.currentProvider
  } else if (provider && provider === WALLET_PROVIDER.PARITY) {
      // Inject window.web3
      opts.ethereum = window.web3.currentProvider
    } else {
      // Default remote node
      opts.ethereum = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`)).currentProvider
    }

  return opts
}

export const timeoutCondition = (timeout: any, rejectReason: any) => new Promise((_, reject) => {
  setTimeout(() => {
    reject(rejectReason)
  },         timeout)
})

/**
 * Converts a value from WEI to ETH
 * @param {String|Number} value
 */
export const weiToEth = (value: Object | number | any) => {
  let ethValue = new Decimal(0)
  if (typeof value === 'string') {
    ethValue = new Decimal(value)
    if (ethValue.gt(0)) {
      return ethValue.div(1e18).toString()
    }
    return new Decimal(0).div(1e18).toString()
  }
  if (value instanceof Decimal && value.gt(0)) {
    return value.div(1e18).toString()
  }
  return ethValue.toString()
}
