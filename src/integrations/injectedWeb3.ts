import { ETHEREUM_NETWORKS } from './constants'
import { weiToEth } from 'utils/helpers'
// const autobind = require('autobind-decorator')

class InjectedWeb3 {
  runProviderUpdate: any
  runProviderRegister: any
  watcherInterval: any
  web3: any
  account: any
  network: any
  balance: any
  walletEnabled: any

  constructor() {
    console.log('INSIDE injectedWeb3 CONSTRUCTOR')
    this.watcher = this.watcher.bind(this)
    
    this.watcherInterval = setInterval(this.watcher, 1000)
  }

  async initialize(opts?: any) {
    this.runProviderUpdate = typeof opts.runProviderUpdate === 'function' ?
      opts.runProviderUpdate : this.runProviderUpdate
    this.runProviderRegister = typeof opts.runProviderRegister === 'function' ?
      opts.runProviderRegister : this.runProviderRegister
  }

  async getNetwork() {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err: any, netId: any) => {
        if (err) {
          reject(err)
        } else {
          switch (netId) {
            case '1': {
              resolve(ETHEREUM_NETWORKS.MAIN)
              break
            }
            case '2': {
              resolve(ETHEREUM_NETWORKS.MORDEN)
              break
            }
            case '3': {
              resolve(ETHEREUM_NETWORKS.ROPSTEN)
              break
            }
            case '4': {
              resolve(ETHEREUM_NETWORKS.RINKEBY)
              break
            }
            case '42': {
              resolve(ETHEREUM_NETWORKS.KOVAN)
              break
            }
            default: {
              resolve(ETHEREUM_NETWORKS.UNKNOWN)
              break
            }
          }
        }
      })
    })
  }

  async getAccount() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(
        (e: any, accounts: any) => {
          if (e) {
            reject(e)
          }
          resolve(accounts && accounts.length ? accounts[0] : null)
        },
      )
    })
  }

  /**
   * Periodic updater to get all relevant information from this provider
   * @async
   */
  async watcher() {
    try {
      const currentAccount = await this.getAccount()
      if (this.account !== currentAccount) {
        this.account = currentAccount
        await this.runProviderUpdate(this, { account: this.account })
      }

      const currentNetwork = await this.getNetwork()
      if (this.network !== currentNetwork) {
        this.network = currentNetwork
        await this.runProviderUpdate(this, { network: this.network })
      }

      const currentBalance = await this.getBalance()
      if (this.balance !== currentBalance) {
        this.balance = currentBalance
        await this.runProviderUpdate(this, { balance: this.balance })
      }

      if (!this.walletEnabled && currentAccount) {
        this.walletEnabled = true
        await this.runProviderUpdate(this, { available: true })
      }
    } catch (err) {
      if (this.walletEnabled) {
        this.walletEnabled = false
        await this.runProviderUpdate(this, { available: false })
      }
    }
  }

  /**
   * Returns the balance for the current default account in Wei
   * @async
   * @returns {Promise<string>} - Accountbalance in WEI for current account
   */
  async getBalance() {
    return new Promise((resolve, reject) => {
      if (this.account) {
        this.web3.eth.getBalance(
          this.account,
          (e: Error, balance: any) => (e ? reject(e) : resolve(weiToEth(balance.toString()))),
        )
      } else {
        return reject(new Error('No Account available'))
      }
    })
  }

}

export default InjectedWeb3
