import { DefaultTokenList, ProviderInterface } from 'api/types'
import { Account } from 'types'
import { promisedWeb3 } from 'api/web3Provider'

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
}
export const checkTokenListJSON = async (json: DefaultTokenList) => {
  if (!Array.isArray(json)) throw new Error('JSON should be an array of token objects')

  const web3 = await promisedWeb3

  let errMessage
  for (const token of json) {
    Object.keys(token).some(key => errMessage = tokenFieldsChecks[key](token[key], web3))
    if (errMessage) throw new Error(`Token ${JSON.stringify(token)} is invalid format: ${errMessage}`)
  }
}
