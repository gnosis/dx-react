const Web3 = require('web3')
const TruffleContract = require('truffle-contract')
const _ = require('lodash')

const windowLoaded = new Promise((accept, reject) => {
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

const contractArtifacts = [
  'DutchExchange',
  'DutchExchangeFactory',
  'DutchExchangeETHGNO',
  'DutchExchangeGNOETH',
  'Token',
  'TokenETH',
  'TokenGNO',
].map(name => require(`../../build/contracts/${name}.json`))

class DutchExchangeInit {
  contracts: object | any
  web3: any

  /** CONSTRUCTOR
   * sets contract artifacts from build/contracts/../.json into TruffleContract(...) 
   * and into DutchExchange.contracts.ContractName
   */
  constructor() {
    this.contracts = _.fromPairs(contractArtifacts.map((artifact) => {
      const c = TruffleContract(artifact)
      const cName = c.contract_name

      return [cName, c]
    }))
  }

  /** static init(opts)
   * @static
   * @param {Object} opts
   * @returns DutchExchangeInit INSTANCE
   * @memberof DutchExchangeInit
   */
  static async init(opts?: object) {
    const dutchX = new DutchExchangeInit()
    await dutchX.fireUp(opts)
    return dutchX
  }

  /** SET UP OPTS PARAM */
  async fireUp(opts?: object | any) {
    await this.setWeb3Provider(opts.ethereum)
  }

  /** ASYNC Class Method: setWeb3Provider
   * @param provider => comes from Redux <opts.ethereum>
   * @param {any} provider
   * @memberof DutchExchangeInit
   */
  async setWeb3Provider(provider: any) {
    if (provider == null) {
      // Prefer Web3 injected by the browser (Mist/MetaMask)
      // Window must be loaded first so that there isn't a race condition for resolving injected Web3 instance
      await windowLoaded

      // if (typeof window.web3 !== 'undefined') {
      if (Object.keys(window.web3).length !== 0) {
        this.web3 = new Web3(window.web3.currentProvider)
      } else {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
      }
    } else if (typeof provider === 'string') {
      this.web3 = new Web3(new Web3.providers.HttpProvider(provider))
    } else if (typeof provider === 'object' && provider.constructor.name.endsWith('Provider')) {
      this.web3 = new Web3(provider)
    } else {
      throw new TypeError(`provider of type '${typeof provider}' not supported`)
    }

    // Set providers for all Contracts
    _.forOwn(this.contracts, (c: any) => { c.setProvider(this.web3.currentProvider) })

    // Attempt to attach all CONTRACT INSTANCES to Class
    await Promise.all([
      this.setupContractInstances('DutchExchange', this.contracts.DutchExchange),
      // this.setupContractInstances('DutchExchangeFactory', this.contracts.DutchExchangeFactory),
      this.setupContractInstances('DutchExchangeETHGNO', this.contracts.DutchExchangeETHGNO),
      this.setupContractInstances('DutchExchangeGNOETH', this.contracts.DutchExchangeGNOETH),
      this.setupContractInstances('Token', this.contracts.Token),
      this.setupContractInstances('TokenETH', this.contracts.TokenETH),
      this.setupContractInstances('TokenGNO', this.contracts.TokenGNO),
    ])
  }

  /** async setupContractInstances(instanceName, contract)
   * Attempts to set deployed contract instance to Class
   * @param {any} instanceName
   * @param {any} contract
   * @memberof DutchExchangeInit
  * */
  async setupContractInstances(instanceName: any, contract: any) {
    try {
      // Attach contract instance to Class and deploy
      console.log(`SUCCESS: Contract ${contract} successfully mounted to DutchExchangeInit instance`)
      this[instanceName] = await contract.deployed()
    } catch (e) {
      delete this[instanceName]
      console.log(`ERROR: ${e.message}`) // eslint-disable-line no-console

      throw (e)
    }
  }

}

export default DutchExchangeInit
