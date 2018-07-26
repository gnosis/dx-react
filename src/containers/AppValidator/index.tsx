import React from 'react'
import { connect } from 'react-redux'

import watcher from 'integrations/watcher'
// import fireListeners from 'integrations/events';
import MetamaskProvider from 'integrations/metamask'

import { updateMainAppState, resetMainAppState, updateProvider, initDutchX } from 'actions'

import { State } from 'types'
import { getTokenList } from 'actions'

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
    const { network, updateMainAppState, updateProvider, resetMainAppState, getTokenList, initDutchX } = this.props

    try {
      addListeners(['online', 'offline'], [this.connect, this.disconnect])

      if (this.state.online) {

        console.warn(`
          App Status: ONLINE
        `)

        /* // TODO: make into init function
        provider.initialize()
        // dispatch action to save provider name and priority
        registerProvider({ provider: provider.providerName, priority: provider.priority }) */

        // Grabs network relevant token list
        // Sets available auctions relevant to that list
        await getTokenList(network)

        // Initiate Provider
        await watcher(MetamaskProvider, { updateMainAppState, updateProvider, resetMainAppState })

        // initialise basic user state
        await initDutchX()

        this.setState({
          SET_UP_COMPLETE: true,
        })

        console.warn(`
          APPVALIDATOR MOUNT FINISHED
        `)
        // start polling for changes and update user state
        return this.startPolling()
      }

      console.warn(`
        App Status: OFFLINE
      `)

    } catch (err) {
      this.setState({
        SET_UP_COMPLETE: false,
      })
      if (this.state.online) {
        console.warn('AppValidator mounting error - please make sure your wallet is available and unlocked then refresh the page.')
        console.error(err)
      }
      this.startPolling(1000)
    }
  }

  componentWillUnmount() {
    removeListeners(['online', 'offline'], [this.connect, this.disconnect])

    clearInterval(this.dataPollerID)
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.unlocked !== this.props.unlocked) {
      console.log(`
        Wallet lock status change detected.
        Unlocked before?: ${this.props.unlocked}
        Unlocked now?:    ${nextProps.unlocked}
      `)
      // if app mount failed and nextProps detect an unlocked wallet
      // reload the page
      if (!this.state.SET_UP_COMPLETE && nextProps.unlocked) {
        window.location.reload()
      }
    }
  }

  connect = () => {
    if (!this.state.online) {
      console.log('​Detected new connection')

      this.startPolling()
      return this.setState({ online: true })
    }
  }

  disconnect = () => {
    if (this.state.online) {
      console.log('​Detected connection loss')

      this.stopPolling()
      return this.setState({ online: false })
    }
  }

  startPolling = (pollTime: number = 5000) => {
    const { updateMainAppState, updateProvider, resetMainAppState } = this.props

    console.log('AppValidator: Polling started')
    return this.dataPollerID = setInterval(() => watcher(MetamaskProvider, { updateMainAppState, updateProvider, resetMainAppState }), pollTime)
  }

  stopPolling = () => (console.log('AppValidator: Polling stopped'), clearInterval(this.dataPollerID))

  renderOfflineApp = ({ online, SET_UP_COMPLETE }: { online: boolean, SET_UP_COMPLETE?: boolean }) =>
    <>
      { !online && <h2 style={offlineBanner}> App is currently offline - please your check internet connection and refresh the page </h2> }
      { (!SET_UP_COMPLETE || !this.props.unlocked) && <h2 style={{ ...offlineBanner, ...{ backgroundColor: 'orange' } }}> App problems detected. Please make sure your wallet is unlocked and refresh the page </h2> }
      {this.props.children}
    </>

  render() {
    const { children, unlocked } = this.props
    return this.state.online && unlocked && this.state.SET_UP_COMPLETE ? children : this.renderOfflineApp(this.state)
  }
}

const mapState = ({ blockchain: { activeProvider, providers } }: State) => ({
  activeProvider,
  network: providers.METAMASK && providers.METAMASK.network,
  unlocked: providers.METAMASK && providers.METAMASK.unlocked,
})

export default connect(mapState, {
  getTokenList,
  initDutchX,
  updateMainAppState,
  updateProvider,
  resetMainAppState,
})(AppValidator)
