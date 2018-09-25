import React, { ComponentClass } from 'react'
import { connect } from 'react-redux'

import Loader from 'components/Loader'

import providerWatcher from 'integrations/providerWatcher'
import Providers from 'integrations/provider'

import { updateMainAppState, resetMainAppState, updateProvider, initApp } from 'actions'

import { State } from 'types'
import { getTokenList } from 'actions'
import { getActiveProvider, getActiveProviderObject } from 'selectors'
import { withRouter } from 'react-router'
import { timeoutCondition } from 'utils'

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
    loading: false,
    SET_UP_COMPLETE: true,
    error: '',
  }

  async componentDidMount() {
    // user has NOT accepted disclaimer, do not load state if user attempts to access some parts of app like Content, Cookies etc
    // user CANNOT get into app as redirect blocks if Disclaimer not accepted
    if (!this.props.disclaimer_accepted) return

    const { activeProvider } = this.props

    try {
      // listens for online/offline status
      addListeners(['online', 'offline'], [this.connect, this.disconnect])

      // fire up app if user is actively connected to internet AND has provider set
      if (this.state.online && activeProvider) {
        // setTimeout condition if loading wallet takes too long
        await Promise.race([
          this.appMountSetup(),
          timeoutCondition(15000, 'Wallet setup timeout. Please refresh the page!'),
        ])

        this.setState({
          loading: false,
          SET_UP_COMPLETE: true,
        })
      }

      return console.warn(`
        App Status: OFFLINE
      `)
    } catch (error) {
      this.setState({
        loading: false,
        SET_UP_COMPLETE: false,
        error,
      })
      if (this.state.online) {
        console.warn('AppValidator mounting error - please make sure your wallet is available and unlocked then refresh the page.')
        console.error(error)
      }
      // start polling for changes
      this.startPolling(3000)
    }
    // If here, no wallets have been detected and app loads in non-provider state
  }

  // removes Listeners and intervals
  componentWillUnmount() {
    removeListeners(['online', 'offline'], [this.connect, this.disconnect])

    clearInterval(this.dataPollerID)
  }

  // Detects any changes in Provider lock status or errors
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.unlocked !== this.props.unlocked) {
      console.log(`
        Wallet lock status change detected.
        Unlocked before?: ${this.props.unlocked}
        Unlocked now?:    ${nextProps.unlocked}
      `)
      // if app mount failed and nextProps detect an unlocked wallet
      // reload the page
      if (!this.state.error && !this.state.SET_UP_COMPLETE && nextProps.unlocked) {
        // window.location.reload()
        this.setState({ SET_UP_COMPLETE: true })
      }
    }
  }

  // Setup and Validate App
  appMountSetup = async () => {
    const { activeProvider, network, updateMainAppState, updateProvider, resetMainAppState, getTokenList, initApp } = this.props
    const currentProvider = Providers[activeProvider]

    try {
      this.setState({ loading: true })

      console.warn(`
        App Status: ONLINE
      `)

      // Grabs network relevant token list
      // Sets available auctions relevant to that list
      await getTokenList(network)
      // Initiate Provider
      await providerWatcher(currentProvider, { updateMainAppState, updateProvider, resetMainAppState })
      // initialise basic user state
      await initApp()

      console.warn(`
      APPVALIDATOR MOUNT FINISHED
      `)

      // start polling for changes and update user state
      return this.startPolling()
    } catch (error) {
      console.error(error)
    }
  }

  // start Polling on connect
  connect = () => {
    if (!this.state.online) {
      console.log('​Detected new connection')

      this.startPolling()
      return this.setState({ online: true })
    }
  }

  // stop polling on disconnect
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

  stopPolling = () => {
    console.log('AppValidator: Polling stopped')

    clearInterval(this.dataPollerID)
    this.dataPollerID = null
  }

  renderError = () => {
    const { error, loading, online, SET_UP_COMPLETE } = this.state,
      { disclaimer_accepted } = this.props
    if (!disclaimer_accepted) return

    return (
      <>
        { (!online && !loading) && <h2 className="offlineBanner"> App is currently offline - please your check internet connection and refresh the page </h2> }
        { ((!SET_UP_COMPLETE && !loading) || (!this.props.unlocked && !loading)) && online && <h2 className="offlineBanner" style={{ backgroundColor: 'orange' }}> { error ? `App problems detected: ${error}` : 'App problems detected. Please check your provider and refresh the page.' } </h2> }
      </>
    )
  }

  render() {
    const { loading } = this.state
    return (
      <>
        {this.renderError()}
        {loading
          ?
        <div className="walletChooser"><Loader hasData={false} strokeColor="#fff" strokeWidth={0.35} render={() => null} message="LOADING WALLET ACCOUNT DETAILS..."/></div>
          :
        this.props.children}
      </>
    )
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

    disclaimer_accepted: state.settings.disclaimer_accepted,
  }
}

export default withRouter(connect(mapState, {
  getTokenList,
  initApp,
  updateMainAppState,
  updateProvider,
  resetMainAppState,
})(AppValidator) as ComponentClass<any>)
