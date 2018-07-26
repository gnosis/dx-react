import { promisedWeb3 } from 'api/web3Provider'
import { Account } from 'types'
import { TransactionObject, BlockReceipt, Hash, TransactionReceipt } from 'api/types'
import Web3 from 'web3'
import { RINKEBY_WEBSOCKET } from 'globals'
import { contractsMap } from 'api/contracts'
import { store } from 'components/App'
import { removeTransaction } from 'actions'
type Error1stCallback<T = any> = (error: Error, result: T) => void

interface Web3Filter {
  get(cb: Error1stCallback): void,
  watch(cb: Error1stCallback): void,
  stopWatching(): void,
  on: any;
}

type BlockStr = 'latest' | 'pending' | 'newBlockHeaders'
type BlockN = BlockStr | number

interface FilterOptions {
  fromBlock: BlockN,
  toBlock: BlockN,
  address: Account | Account[],
  topics: (string | null)[],
}

let mainFilter: Web3Filter
const accumCB: Error1stCallback<Hash>[] = []
const mainFilterCB: Error1stCallback<Hash> = (error, blockHash) => {
  if (error) return console.error(error)

  for (const cb of accumCB) cb(error, blockHash)
}

export const getFilter = async (options: BlockN | FilterOptions = 'newBlockHeaders', reuse = true): Promise<Web3Filter> => {
  if (mainFilter && reuse) return mainFilter

  const web3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_WEBSOCKET))
  const filter = web3.eth.subscribe(options, (e: Error) => {
    if (e) console.log(e)
  })
  if (reuse) mainFilter = filter

  return filter
}

export const watch = async (cb: Error1stCallback<Hash>): Promise<Web3Filter['stopWatching']> => {
  const filter = await getFilter()

  const length = accumCB.push(cb)
  // if it's the first callback added
  // start watching
  if (length === 1) filter.on('data', mainFilterCB)

  return () => {
    const cbInd  = accumCB.indexOf(cb)

    if (cbInd !== -1) {
      // remove callback
      accumCB.splice(cbInd, 1)
      // if accumCB is empty, stop watching alltogether
      if (accumCB.length === 0) filter.stopWatching()
    }
  }
}

export const isTxInBlock = (blockReceipt: BlockReceipt, tx:Hash) => {
  const { transactions } = blockReceipt

  if (transactions.length === 0) return false
  if (typeof transactions[0] === 'string') return (transactions as Hash[]).includes(tx)
  return (transactions as TransactionObject[]).find(txObj => txObj.hash === tx)
}

export const getBlock = async (bl: Hash, returnTransactionObjects?: boolean) => {
  const { getBlock } = await promisedWeb3
  return getBlock(bl, returnTransactionObjects)
}

// waits for tx hash to appear included in the latest block
export const waitForTxInBlock = async (hash: Hash, reuse: boolean = true) => {
  const filter = await getFilter('latest', reuse)
  const watchFunc: typeof watch = reuse ? watch : filter.watch.bind(filter)

  let stopWatchingFunc: () => void, res: BlockReceipt

  try {
    res = await new Promise<BlockReceipt>(async (resolve, reject) => {
      stopWatchingFunc = await watchFunc(async (e: Error, bl: Hash) => {
        if (e) return reject(e)

        const blReceipt = await getBlock(bl)

        if (isTxInBlock(blReceipt, hash)) resolve(blReceipt)
      })
    })
  } catch (error) {
    // don't stop watching the mainFilter
    stopWatchingFunc()
    throw error
  }
  stopWatchingFunc()

  return res
}

export const waitForEvent = async (txHash: string, eventToFind: string) => {
  // listen to DX events
  const { DutchExchange } = contractsMap
  const WSweb3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_WEBSOCKET))
  const DX = new WSweb3.eth.Contract(DutchExchange.abi, '0x2ade4c3d9fd649ff6e97dcb50b684984bc8f6375')

  let eventWatch: any
  let res: any
  try {
    res = await new Promise((accept, reject) => {
      eventWatch = DX.events.allEvents({ fromBlock: 'latest' }, (err: Error) => {
        if (err) reject(err)
      })
      .on('data', (event: any) => {
        console.log('EVENT: ', event)
        console.log('EVENT.EVENT: ', event.event)
        console.log('EVENT.transactionHash: ', event.transactionHash)
        console.log(`
        Looking for txHash: ${txHash}
        Looking for event : ${eventToFind}
        `)
        if (event.event === eventToFind && event.transactionHash === txHash) {
          store.dispatch(removeTransaction({ txHash }))
          accept(event)
        } else {
          console.log('Not the correct EVENT and/or TX_HASH')
        }
        // dispatch event here
        // store.dispatch(saveDXEvent({ event }))
      })
      .on('error', (err: Error) => reject(err))
    })
  } catch (error) {
    console.error(error)
    eventWatch.unsubscribe((e: Error, res: any) => e ? console.error(e) : console.log(res))
  }

  eventWatch.unsubscribe((e: Error, res: any) => e ? console.error(e) : console.log(res))

  return res
}

export const waitForLog = async (txHash: string, address?: string) => {

  const WSweb3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_WEBSOCKET))

  let eventWatch: any
  let res: any
  try {
    res = await new Promise((accept, reject) => {
      eventWatch = WSweb3.eth.subscribe('logs', { fromBlock: 'latest', address }, (err: Error) => {
        if (err) reject(err)
      })
      .on('data', (log: any) => {
        console.log('LOG: ', log)
        console.log('LOG.ADDRESS: ', log.address)
        console.log('EVENT.transactionHash: ', log.transactionHash)
        console.log(`
        Looking for txHash:   ${txHash}
        Looking for log from: ${address}
        `)
        if (log.transactionHash === txHash) {
          store.dispatch(removeTransaction({ txHash }))
          accept(event)
        } else {
          console.log('Not the correct LOG ADDRESS and/or TX_HASH')
        }
        // dispatch event here
        // store.dispatch(saveDXEvent({ event }))
      })
      .on('error', (err: Error) => reject(err))
    })
  } catch (error) {
    console.error(error)
    eventWatch.unsubscribe((e: Error, res: any) => e ? console.error(e) : console.log(res))
  }

  eventWatch.unsubscribe((e: Error, res: any) => e ? console.error(e) : console.log(res))

  return res
}

export const waitForTx = async (hash: Hash, reuse: boolean = true) => {
  const filter = await getFilter('newBlockHeaders', reuse)
  const watchFunc: typeof watch = reuse ? watch : filter.on.bind(filter)

  let stopWatchingFunc: () => void, res: TransactionReceipt

  const { getTransactionReceipt } = await promisedWeb3

  try {
    console.log('STARTED WATCHING', hash)

    res = await new Promise<TransactionReceipt>(async (resolve, reject) => {
      stopWatchingFunc = await (watchFunc as any)('data', async (e: Error, bl: Hash) => {
        if (e) return reject(e)

        const txReceipt = await getTransactionReceipt(hash)

        if (txReceipt) {
          console.log(`FOUND ${hash} receipt after block ${bl}`)
          // tx is mined
          // based on if succeeded, resolve or reject
          txReceipt.status === '0x1' ? resolve(txReceipt) : reject(txReceipt)
        } else console.log(`NO ${hash} receipt after block ${bl}`)
      })
    })
  } catch (error) {
    // don't stop watching the mainFilter
    stopWatchingFunc()
    throw error
  }
  stopWatchingFunc()
  console.log('STOPPED WATCHING', hash)

  return res
}
