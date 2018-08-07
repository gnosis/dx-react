import localForage from 'localforage'
import { store } from 'components/App'
// import { watch, getBlock } from 'integrations/filterChain'
import { promisedWeb3 } from 'api/web3Provider'
import { code2Network } from 'utils/helpers'

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

  // TEMP SAMPLE USAGE
  // watch(async (e, bl) => {
  //   console.log(' ==> 2: Block watcher fired')
  //   if (e) return console.error('Chain watching Error', e)
  //   console.log('LATEST BLOCK')
  //   console.log(await getBlock(bl))
  // })
}

export default fireListeners
