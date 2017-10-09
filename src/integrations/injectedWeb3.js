import { ETHEREUM_NETWORKS, WALLET_PROVIDER } from 'integrations/constants'

class InjectedWeb3 {
  async getNetwork() {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, netId) => {
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
        (e, accounts) => {
          if (e) {
            reject(e)
          }
          resolve(accounts && accounts.length ? accounts[0] : null)
        },
      )
    })
  }

}

export default InjectedWeb3
