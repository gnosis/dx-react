import { ProviderInterface } from './types'
import { windowLoaded } from './utils'
import { Account } from 'types'
import Web3 from 'web3'
import { toBigNumber } from 'api'

const getProvider = () => {
  if (typeof window !== 'undefined' && window.web3) {
    return new Web3(window.web3.currentProvider)
  }

  return new Web3.setProvider('http://localhost:8545')
}

const setupWeb3 = async () => {
  await windowLoaded

  return new Web3(getProvider())
}

export const promisedWeb3 = init()

async function init(): Promise<ProviderInterface> {
  try {
    if ((typeof navigator !== 'undefined' && !navigator.onLine) || typeof window.web3  === 'undefined') throw 'Web3 connectivity issues due to client network connectivity loss'

    const web3 = await setupWeb3()

    const getAccounts = web3.eth.getAccounts
    const getBalance = web3.eth.getBalance

    const getBlock = web3.eth.getBlock
    const getTransaction = web3.eth.getTransaction
    const getTransactionReceipt = web3.eth.getTransactionReceipt

    const getCurrentAccount = async () => {
      const [account] = await getAccounts()

      return account
    }

    const getETHBalance = async (account: Account, inETH?: boolean) => {
      const wei = await getBalance(account)

      return inETH ? toBigNumber(web3.utils.fromWei(wei, 'ether')) : toBigNumber(wei)
    }

    const getNetwork = async () => web3.eth.net.getId()

    // const isConnected = web3.isConnected.bind(web3)

    const isListening = async (): Promise<boolean> => web3.eth.net.isListening()

    const setProvider = web3.setProvider.bind(web3)

    const isAddress = (address: Account) => web3.utils.isAddress(address)

    const resetProvider = () => setProvider(getProvider())

    const getTimestamp = async (block = 'latest') => {
      const blockData = await web3.eth.getBlock(block)

      return blockData.timestamp
    }
    console.warn(`
      API/WEB3 SETUP FINISHED
    `)
    return {
      getCurrentAccount,
      getAccounts,
      getBlock,
      getTransaction,
      getTransactionReceipt,
      getETHBalance,
      getNetwork,
      // isConnected,
      isAddress,
      isConnected: isListening,
      get currentProvider() {
        return web3.currentProvider
      },
      web3,
      setProvider,
      resetProvider,
      getTimestamp,
    }
  } catch (err) {
    console.error(err)
  }
}
