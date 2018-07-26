import localForage from 'localforage'
import { store } from 'components/App'
// import { watch, getBlock } from 'integrations/filterChain'
import { promisedWeb3 } from 'api/web3Provider'
import { code2Network } from 'utils/helpers'
import { contractsMap } from 'api/contracts'
import { saveDXEvent, saveLogs } from 'actions'
import Web3 from 'web3'
import { RINKEBY_WEBSOCKET } from 'globals'

// ========== //
// scope vars //
// ========== //

let netID: string
let web3: any
// =============== //
// event listeners //
// =============== //

const fireListeners = async () => {
  console.log('FIRING LISTENERS')
  // set up websocket web3
  web3 = (await promisedWeb3).web3

  const WSweb3 = new Web3(new Web3.providers.WebsocketProvider(RINKEBY_WEBSOCKET))

  web3.currentProvider                    &&
  web3.currentProvider.publicConfigStore  &&
  web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress, networkVersion }: any) => {
    const { currentAccount: currentAccountFromState, providers: { METAMASK: { network: networkFromState } } } = store.getState().blockchain
    const { defaultTokenList } = store.getState().tokenList

    console.log(`
      [[LISTENER]] ---> CHANGES DETECTED
        >>====> Account Before: ${currentAccountFromState}
        >>====> Account After:  ${selectedAddress}
        >>====> Network Before: ${netID}
        >>====> Network After:  ${networkVersion}
      [[LISTENER]]
    `)

    if (netID === networkVersion) return

    // set scoped netID var to networkVersion detected
    netID = networkVersion

    console.log(`
      [[LISTENER]] --> NETWORK CHANGE DETECTED
        >>====> localNetID      ${netID}
        >>====> C.Net.ID:       ${networkVersion}
      [[LISTENER]]
    `)

    if (
      // network undefined (page refresh)
      (!netID && defaultTokenList.length < 1) ||
      // change of networks
      ((netID !== networkVersion) && defaultTokenList.length < 1) ||
      // state network !== networkVersion (network change)
      networkFromState !== code2Network(networkVersion)
    ) {
      netID = networkVersion

      console.log(`
        [[LISTENER]] --> NETWORK CHANGE DETECTED, GRABBING NEW NETWORK TOKEN LIST
      `)

      localForage.removeItem('defaultTokens')
    }
  })

  const defaultCB = (e: Error) => {
    if (e) throw (e)
  }

  const createFilter = (type: string, options: any = [defaultCB]) => WSweb3.eth.subscribe(type, ...options)

  // New Data filter
  createFilter('newBlockHeaders', [defaultCB]).on('data', (log: any) => {
    console.log('Block update:', log)
    store.dispatch(saveLogs({ log }))
  })

  createFilter('logs', [{ fromBlock: 'latest', address: '0xc778417e063141139fce010982780140aa0cd5ab' }, defaultCB])
    .on('data', (log: any) => {
      console.log('logs', log)
    })
    .on('confirmation', (res: any) => console.log('CONFIRMATION CONFIRMATION', res))

  // listen to DX events
  const { DutchExchange } = contractsMap
  const DX = new WSweb3.eth.Contract(DutchExchange.abi, '0x2ade4c3d9fd649ff6e97dcb50b684984bc8f6375')
  DX.events.allEvents({ fromBlock: 'latest' }, (err: Error) => {
    if (err) console.error(err)
  })
  .on('data', (event: any) => {
    console.log(event)
    // dispatch event here
    store.dispatch(saveDXEvent({ event }))
  })
  .on('error', (err: Error) => console.error(err))

  // TEMP SAMPLE USAGE
  // watch(async (e, bl) => {
  //   console.log(' ==> 2: Block watcher fired')
  //   if (e) return console.error('Chain watching Error', e)
  //   console.log('LATEST BLOCK')
  //   console.log(await getBlock(bl))
  // })
}

export default fireListeners
