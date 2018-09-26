import Web3 from 'web3'

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

import { promisedWeb3 } from 'api/web3Provider'
import { logDecoder } from 'ethjs-abi'

import { DefaultTokenList, ProviderInterface, DefaultTokenObject, Receipt, ABI, Web3EventLog } from 'api/types'
import { Account } from 'types'
import { ETH_ADDRESS, WALLET_PROVIDER, DEFAULT_ERROR, CANCEL_TX_ERROR, NO_INTERNET_TX_ERROR, LOW_GAS_ERROR, ProviderName, ProviderType } from 'globals'

export const windowLoaded = new Promise((accept, reject) => {
  if (typeof window === 'undefined') {
    return accept()
  }

  if (typeof window.addEventListener !== 'function') {
    return reject(new Error('expected to be able to register event listener'))
  }

  window.addEventListener('load', function loadHandler(event) {
    window.removeEventListener('load', loadHandler, false)
    return accept(event)
  }, false)
})

export const readFileUpload = (file: File) =>
    new Promise((resolve) => {
      const r = new FileReader()
      r.onload = (e: any) => resolve(e.target.result)
      r.readAsArrayBuffer(file)
    })

export const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const r = new FileReader()
      r.onload = (e: any) => resolve(e.target.result)
      r.readAsText(file)
    })

export const promisify = (func: Function, context: object, ...defArgs: any[]) =>
  (...args: any[]): Promise<any> => new Promise((res, rej) => {
    func.apply(context, [...defArgs, ...args, (err: Error, result: any) => err ? rej(err) : res(result)])
  })

const tokenFieldsChecks = {
  address: (addr: Account, web3: ProviderInterface) => {
    if (typeof addr !== 'string') return 'token address should be a string'
    if (!web3.isAddress(addr)) return 'token address isn\'t a vaild Ethereum address'
  },
  name: (name: string) => {
    if (typeof name !== 'string') return 'token name should be a string'
    if (name.length === 0) return 'token name should not be an empty string'
  },
  symbol: (symbol: string) => {
    if (typeof symbol !== 'string') return 'token symbol should be a string'
    if (symbol.length === 0) return 'token symbol should not be an empty string'
  },
  decimals: (decimals: number | string) => {
    if (typeof decimals !== 'number' && typeof decimals !== 'string') return 'token decimals should be a number or a string'
    if (decimals < 1) return 'token decimals should not be less than 1'
  },
  isETH: (isETH: boolean, _: ProviderInterface, token: DefaultTokenObject) => {
    // no more checks for not-ETHER tokens
    if (!isETH) return

    const { symbol, address, name, decimals } = token
    if (symbol !== 'ETH' || name !== 'ETHER' || address !== ETH_ADDRESS || decimals !== 18) {
      return 'only one token can represent ETHER'
    }
  },
}
export const checkTokenListJSON = async (json: DefaultTokenList) => {
  if (!Array.isArray(json)) throw new Error('JSON should be an array of token objects')

  const web3 = await promisedWeb3

  let errMessage
  for (const token of json) {
    Object.keys(token).some(key => errMessage = tokenFieldsChecks[key](token[key], web3, token))
    if (errMessage) throw new Error(`Token ${JSON.stringify(token)} is invalid format: ${errMessage}`)
  }
}

type Decoder = (logs: Receipt['logs']) => Web3EventLog[]

const decodersMap = new WeakMap<ABI, Decoder>()

export const getDecoderForABI = (abi: ABI): Decoder => {
  if (decodersMap.has(abi)) return decodersMap.get(abi)

  const decoder = logDecoder(abi)
  decodersMap.set(abi, decoder)
  return decoder
}

export const provider2SVG = (providerName: ProviderName | ProviderType) => {
  console.log('TCL: provider2SVG -> providerName', providerName)
  switch (providerName) {
    case 'GNOSIS SAFE':
      return 'img/icon_gnosis_safe1.svg'

    case 'STATUS':
      return 'img/icon_status.svg'

    case 'LEDGER':
      return 'img/icon_ledger.svg'

    case 'METAMASK':
      return 'img/icon_metamask3.svg'

    default:
      return 'img/icon_cross.svg'
  }
}

export const web3CompatibleNetwork = async () => {
  if (typeof window === 'undefined' || !window.web3) return 'UNKNOWN'

  let netID

  // 1.X.X API
  if (typeof window.web3.version === 'string') {
    netID = await new Promise((accept, reject) => {
      window.web3.eth.net.getId((err: string, res: string) => {
        if (err) {
          reject('UNKNOWN')
        } else {
          accept(res)
        }
      })
    })
  } else {
    // 0.2X.xx API
    netID = window.web3.version.network
  }

  return netID
}

export const lastArrVal = (arr: Array<any>) => arr[arr.length - 1]
