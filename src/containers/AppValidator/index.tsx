import React from 'react'
import { connect } from 'react-redux'

import providerWatcher from 'integrations/providerWatcher'
import Providers from 'integrations/provider'

import { updateMainAppState, resetMainAppState, updateProvider, initDutchX } from 'actions'

import { State } from 'types'
import { getTokenList } from 'actions'
import { getActiveProvider, getActiveProviderObject } from 'selectors'

const inBrowser = typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'

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
    error: '',
  }

  async componentWillMount() {
    // const provider = MetamaskProvider,
    const { activeProvider, network, updateMainAppState, updateProvider, resetMainAppState, getTokenList, initDutchX } = this.props
    const currentProvider = Providers[activeProvider]
    try {
      addListeners(['online', 'offline'], [this.connect, this.disconnect])

      if (this.state.online) {

        console.warn(`
          App Status: ONLINE
        `)

        // Grabs network relevant token list
        // Sets available auctions relevant to that list
        await getTokenList(network)

        // Initiate Provider
        await providerWatcher(currentProvider, { updateMainAppState, updateProvider, resetMainAppState })

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

    } catch (error) {
      this.setState({
        SET_UP_COMPLETE: false,
        error,
      })
      if (this.state.online) {
        console.warn('AppValidator mounting error - please make sure your wallet is available and unlocked then refresh the page.')
        console.error(error)
      }
      this.startPolling(3000)
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
    const { activeProvider, updateMainAppState, updateProvider, resetMainAppState } = this.props,
      currentProvider = Providers[activeProvider]

    console.log('AppValidator: Polling started')
    return this.dataPollerID = setInterval(() => providerWatcher(currentProvider, { updateMainAppState, updateProvider, resetMainAppState }).catch(console.warn), pollTime)
  }

  stopPolling = () => (console.log('AppValidator: Polling stopped'), clearInterval(this.dataPollerID))

  renderOfflineApp = ({ error, online, SET_UP_COMPLETE }: { error: string, online: boolean, SET_UP_COMPLETE?: boolean }) =>
    <>
      { !online && <h2 className="offlineBanner"> App is currently offline - please your check internet connection and refresh the page </h2> }
      { (!SET_UP_COMPLETE || !this.props.unlocked) && online && <h2 className="offlineBanner" style={{ backgroundColor: 'orange' }}> { error ? `App problems detected: ${error}` : 'App problems detected. Please check your provider and refresh the page.' } </h2> }
      {this.props.children}
    </>

  render() {
    const { children, unlocked, available } = this.props

    if (!available) return children

    return this.state.online && unlocked && this.state.SET_UP_COMPLETE ? children : this.renderOfflineApp(this.state)
  }
}

const mapState = (state: State) => {
  const activeProvider = getActiveProvider(state)
  const provider = getActiveProviderObject(state)

  return {
    activeProvider,
    network: provider ? provider.network : 'UNKNOWN NETWORK',
    unlocked: provider && provider.unlocked,
    available: provider && provider.available,
  }
}

export default connect(mapState, {
  getTokenList,
  initDutchX,
  updateMainAppState,
  updateProvider,
  resetMainAppState,
})(AppValidator)
