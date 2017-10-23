import { WALLET_PROVIDER } from '../constants'
import InjectedWeb3 from '../injectedWeb3'
import { Blockchain } from 'selectors/blockchain'
const Web3 = require('web3')

export default class Remote extends InjectedWeb3 {
  static providerName = WALLET_PROVIDER.REMOTE

  constructor(...props: any[]) {
    super(...props)

    this.providerName = Remote.providerName
  }

  // async initialize(store) {
  //   this.store = store
  //   this.store.dispatch(registerProvider({ provider: WALLET_PROVIDER.REMOTE }))
  //   this.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))
  //   const canSubscribe = !(store.getState().blockchain && store.getState().blockchain.activeProvider)
  //   let account
  //   let network

  //   if (canSubscribe) {
  //     console.log('remote node available')
  //     network = await this.getNetwork()
  //     account = await this.getAccount()
  //   }

  //   return await this.store.dispatch(updateProvider({
  //     provider: WALLET_PROVIDER.REMOTE,
  //     available: account !== undefined,
  //     network,
  //     account,
  //   }))
  // }

  static async initialize(runProviderFuncs: { [key: string]: Function }) {
    const { registerProvider, updateProvider, getState } = runProviderFuncs

    super.initialize(runProviderFuncs)

    registerProvider(Remote.providerName)

    // creates instance of Remote class
    const instance = new this
    instance.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))

    const providerState = await instance.getInitialState(getState())
    return updateProvider(Remote.providerName, providerState)
  }

  public async getInitialState({ blockchain }: { blockchain: Blockchain }) {

    this.web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.ETHEREUM_URL}`))
    // Check if no activeProvider set
    const canSubscribe = !(blockchain && blockchain.activeProvider)

    if (canSubscribe) {
      console.log('remote node available')
      [this.network, this.account] = await Promise.all([
        this.getNetwork(),
        this.getAccount(),
      ])
    }

    return {
      available: this.account !== undefined,
      network: this.network,
      account: this.account,
    }
  }
}
