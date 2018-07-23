import React from 'react'
import { connect } from 'react-redux'

// import { loadSettings } from 'components/App';

import watcher from 'integrations/watcher'
// import fireListeners from 'integrations/events';
import MetamaskProvider from 'integrations/metamask'

import { updateMainAppState, resetMainAppState, updateProvider, registerProvider, initDutchX, setApprovedTokens, setAvailableAuctions } from 'actions'

import { State } from 'types'
import { getTokenList } from 'actions'
import { getApprovedTokensFromAllTokens, getAvailableAuctionsFromAllTokens } from 'api'
// import fireListeners from 'integrations/events';

const inBrowser = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
const offlineBanner: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#f78484',
  lineHeight: 'initial',
  textAlign: 'center',
  width: '100%',
  fontWeight: 300,
  padding: '5px 0px',
}
const removeListeners = (listeners: string[], actors: EventListenerOrEventListenerObject[]) => {
  listeners.forEach((l, i) => window.removeEventListener(l, actors[i]))
}

const addListeners = (listeners: string[], actors: EventListenerOrEventListenerObject[]) => {
  listeners.forEach((l, i) => window.addEventListener(l, actors[i]))
}

class AppValidator extends React.Component<any> {
  dataPollerID: any | NodeJS.Timer
  state = {
    online: inBrowser ? navigator.onLine : true,
    SET_UP_COMPLETE: true,
  }

  async componentWillMount() {
    // const provider = MetamaskProvider,
    const { setApprovedTokens, setAvailableAuctions, updateMainAppState, updateProvider, resetMainAppState, getTokenList, initDutchX } = this.props

    try {
      addListeners(['online', 'offline'], [this.connect, this.disconnect])
      // await fireListeners()

      if (this.state.online) {
        console.warn(`
          App Status: ONLINE
        `)

        /* // TODO: make into init function
        provider.initialize()
        // dispatch action to save provider name and priority
        registerProvider({ provider: provider.providerName, priority: provider.priority }) */

        const { combinedTokenList } = await getTokenList()

        const [approvedTokenAddresses, availableAuctions] = await Promise.all([
          getApprovedTokensFromAllTokens(combinedTokenList),
          getAvailableAuctionsFromAllTokens(combinedTokenList),
        ])

        console.log(`
          APPROVED TOKEN ADDRESSES: ${JSON.stringify(approvedTokenAddresses, undefined, 2)}
          AVAILABLE AUCTIONS: ${JSON.stringify(availableAuctions, undefined, 2)}
        `)

        setApprovedTokens(approvedTokenAddresses)
        setAvailableAuctions(availableAuctions)

        await watcher(MetamaskProvider, { updateMainAppState, updateProvider, resetMainAppState })
        await initDutchX()

        this.setState({
          SET_UP_COMPLETE: true,
        })

        return this.startPolling()
      }

      console.warn(`
        App Status: OFFLINE
      `)

    } catch (err) {
      console.error('AppValidator mounting error - please check connection/Web3/network and refresh the page. Error:', err)
      this.setState({
        SET_UP_COMPLETE: false,
      })
    }
  }

  componentWillUnmount() {
    removeListeners(['online', 'offline'], [this.connect, this.disconnect])

    clearInterval(this.dataPollerID)
  }

  connect = () => {
    if (!this.state.online) {
      console.log('​Detected new connection. Starting poll.')

      this.startPolling()
      return this.setState({ online: true })
    }
  }

  disconnect = () => {
    if (this.state.online) {
      console.log('​Detected connection loss. Stopping poll.')

      this.stopPolling()
      return this.setState({ online: false })
    }
  }

  startPolling = () => {
    const { updateMainAppState, updateProvider, resetMainAppState } = this.props
    return this.dataPollerID = setInterval(() => watcher(MetamaskProvider, { updateMainAppState, updateProvider, resetMainAppState }), 5000)
  }

  stopPolling = () => clearInterval(this.dataPollerID)

  renderOfflineApp = ({ online, SET_UP_COMPLETE }: { online: boolean, SET_UP_COMPLETE?: boolean }) =>
    <>
      { !online && <h2 style={offlineBanner}> App is currently offline - please your check internet connection and refresh the page </h2> }
      { !SET_UP_COMPLETE && <h2 style={{ ...offlineBanner, ...{ backgroundColor: 'orange' } }}> App init failed - please check connection + provider and refresh the page </h2> }
      {this.props.children}
    </>

  render() {
    const { children } = this.props
    return this.state.online && this.state.SET_UP_COMPLETE ? children : this.renderOfflineApp(this.state)
  }
}

const mapState = ({ blockchain: { activeProvider, providers } }: State) => ({
  activeProvider,
  unlocked: providers.METAMASK && providers.METAMASK.unlocked,
})

export default connect(mapState, {
  getTokenList,
  setApprovedTokens,
  setAvailableAuctions,
  initDutchX,
  updateMainAppState,
  updateProvider,
  resetMainAppState,
  registerProvider,
})(AppValidator)
