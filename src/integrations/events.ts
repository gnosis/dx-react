import { watch, getBlock } from 'integrations/filterChain'
import localForage from 'localforage'
import { promisedWeb3 } from 'api/web3Provider'
import { store } from 'components/App'

// ========== //
// scope vars //
// ========== //

let netID: string

// =============== //
// event listeners //
// =============== //

const fireListeners = async () => {
  console.log('FIRING LISTENERS')

  const { web3  } = await promisedWeb3
  web3.currentProvider.publicConfigStore.on('update', async ({ selectedAddress, networkVersion }: any) => {

    if (selectedAddress === store.getState().blockchain.currentAccount && netID === networkVersion) return

    console.log(`
    ==> 1: Network watcher fired, detected network change
      L.Net.ID  ${netID}
      C.Net.ID: ${networkVersion}
    `)
    // alert(`networkVersions: ${networkVersion} ${netID}`)
    if (!netID || netID !== networkVersion) {
      netID = networkVersion
      await localForage.removeItem('defaultTokens')
    }
  })

  // TEMP SAMPLE USAGE
  watch(async (e, bl) => {
    console.log(' ==> 2: Block watcher fired')
    if (e) return console.error('Chain watching Error', e)
    console.log('LATEST BLOCK')
    console.log(await getBlock(bl))
  })
}

fireListeners()
