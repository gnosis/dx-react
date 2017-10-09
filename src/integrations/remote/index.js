import { WALLET_PROVIDER } from 'integrations/constants'
import { registerProvider, updateProvider } from 'actions/blockchain'
import InjectedWeb3 from 'integrations/injectedWeb3'
import config from 'config'
import Web3 from 'web3'

class Remote extends InjectedWeb3 {

  async initialize(store) {
    this.store = store
    this.store.dispatch(registerProvider({ provider: WALLET_PROVIDER.REMOTE }))
    this.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))
    const canSubscribe = !(store.getState().blockchain && store.getState().blockchain.activeProvider)
    let account
    let network

    if (canSubscribe) {
      console.log('remote node available')
      network = await this.getNetwork()
      account = await this.getAccount()
    }

    return await this.store.dispatch(updateProvider({
      provider: WALLET_PROVIDER.REMOTE,
      available: account !== undefined,
      network,
      account,
    }))
  }
}
export default new Remote()
