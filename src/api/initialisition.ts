/**
 * Initialisation Class for connecting to Blockchain - Setting Provider - Migrating//Connecting Contracts
 */

const Web3 = require('web3')
const TruffleContract = require('truffle-contract')
const _ = require('lodash')

/** EVENT LISTENER: WINDOW:LOAD
 * Checks that window is loaded
 * If browser is unable to listen to events, REJECT
 * Else ACCEPT
 */
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

/** ARRAY of Contract Artifacts
 * ^ that
 */
const contractArtifacts = [
  'DutchExchange',
  'DutchExchangeFactory',
  'Token',
  'ERC20Interface',
].map(name => require(`../../build/contracts/${name}.json`))

class DutchExchangeInit {
  contracts: Object | any
  web3: any
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
  static init(opts?: Object) {
    console.log(' ===> FIRING dutchX.init()') //eslint-disable-line
    const dutchX = new DutchExchangeInit()
    dutchX.fireUp(opts)
    return dutchX
  }

  /* SET UP OPTS PARAM */
  async fireUp(opts?: Object | any) {
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

      if (typeof window.web3 !== 'undefined') {
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
      this.setupContractInstances('Balance', this.contracts.Balance),
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
      console.log(`SUCCESS: Contract ${contract} successfully mounted to DutchExchangeInit instance`) // eslint-disable-line no-console
      this[instanceName] = await contract.deployed()
    } catch (e) {
      delete this[instanceName]
      console.log(`ERROR: ${e.message}`) // eslint-disable-line no-console

      throw (e)
    }
  }

}

export default DutchExchangeInit
