import { ETHEREUM_NETWORKS } from './constants'
// const autobind = require('autobind-decorator')

const WATCHER_INTERVAL = 10000

const networkById = {
  1: ETHEREUM_NETWORKS.MAIN,
  2: ETHEREUM_NETWORKS.MORDEN,
  3: ETHEREUM_NETWORKS.ROPSTEN,
  4: ETHEREUM_NETWORKS.RINKEBY,
  42: ETHEREUM_NETWORKS.KOVAN,
}

export default class InjectedParent {
  private watcherInterval: number
  protected account: any
  protected network: any
  protected balance: any
  protected walletEnabled: boolean = false
  protected web3: any
  protected providerName: string

  protected static registerProvider: Function
  protected static updateProvider: Function

  protected constructor() {

    this.watcherInterval = setInterval(this.watcher.bind(this), WATCHER_INTERVAL)
  }

  static initialize({ registerProvider, updateProvider }: { [key: string]: Function }) {
    InjectedParent.registerProvider = registerProvider
    InjectedParent.updateProvider = updateProvider
  }

  /**
   * Periodic updater to get all relevant information from this provider
   * @async
   */
  protected async watcher() {
    try {
      const [currentAccount, currentNetwork] = await Promise.all([
        this.getAccount(),
        this.getNetwork(),
      ])

      const providerState: { [key: string]: any } = {}

      if (this.account !== currentAccount) {
        this.account = providerState.account = currentAccount
      }

      if (this.network !== currentNetwork) {
        this.network = providerState.network = currentNetwork
      }

      // depends on this.account set inside this.getAccount
      // TODO: rewrite in a more independent way
      const currentBalance = await this.getBalance()

      if (this.balance !== currentBalance) {
        this.balance = providerState.balance = currentBalance
      }

      if (!this.walletEnabled && currentAccount) {
        this.walletEnabled = providerState.available = true
      }

      console.log('WATCHER state', providerState)

      // if providerState is filled with new data
      if (Object.keys(providerState).length) {
        InjectedParent.updateProvider(this.providerName, providerState)
      }
    } catch (err) {
      if (this.walletEnabled) {
        this.walletEnabled = false
        return InjectedParent.updateProvider(this.providerName, { available: false })
      }
    }
  }

  protected async getNetwork() {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err: Error, netId: any) => {
        if (err) {
          return reject(err)
        }

        resolve(networkById[netId] || ETHEREUM_NETWORKS.UNKNOWN)
      })
    })
  }

  protected async getAccount() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(
        (e: Error, accounts: any) => {
          if (e) {
            return reject(e)
          }
          resolve(accounts && accounts.length ? accounts[0] : null)
        },
      )
    })
  }

  /**
   * Returns the balance for the current default account in Wei
   * @async
   * @returns {Promise<string>} - Accountbalance in WEI for current account
   */
  protected async getBalance() {
    return new Promise((resolve, reject) => {
      if (this.account) {
        this.web3.eth.getBalance(
          this.account,
          (e: Error, balance: any) => (e ? reject(e) : resolve(this.web3.fromWei(balance, 'ether'))),
        )
      } else {
        reject(new Error('No Account available'))
      }
    })
  }

}
