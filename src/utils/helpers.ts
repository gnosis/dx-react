import { WALLET_PROVIDER } from 'integrations/constants'
import Web3 from 'web3'
import { CANCEL_TX_ERROR, NO_INTERNET_TX_ERROR, DEFAULT_ERROR, LOW_GAS_ERROR } from 'globals'

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
    opts.ethereum = new Web3(
      new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`),
    ).currentProvider
  }

  return opts
}

export const code2Network = (code: '1' | '4' | '42') => {
  switch (code) {
    case '1':
      return 'MAIN'

    case '4':
      return 'RINKEBY'

    case '42':
      return 'KOVAN'

    default:
      return 'UNKNOWN'
  }
}

export const timeoutCondition = (timeout: any, rejectReason: any) => new Promise((_, reject) => {
  setTimeout(() => {
    reject(rejectReason)
  }, timeout)
})

export const handleKeyDown = ({ key }: { key: string }, fn: Function, codeCheck: string = 'Escape') => {
  if (key === codeCheck) return fn()
  return
}

// compare object properties
export const shallowDifferent = (obj1: object, obj2: object) => {
  if (!obj1 || !obj2) return true

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return true

  return keys1.some(key => obj1[key] !== obj2[key])
}

export const displayUserFriendlyError = (error: string) => {
  if (typeof error !== 'string') return DEFAULT_ERROR

  const err = error.toLowerCase()

  if (err.includes('user denied transaction signature')) return CANCEL_TX_ERROR
  else if (err.includes('failed to fetch')) return NO_INTERNET_TX_ERROR
  else if (err.includes('intrinsic gas too low')) return LOW_GAS_ERROR

  return DEFAULT_ERROR
}
