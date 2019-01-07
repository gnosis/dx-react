import { connect } from 'react-redux'
import { asyncSaveSettings } from 'actions'
import { RouteComponentProps } from 'react-router'

import { State, Settings } from 'types'

import Disclaimer from 'components/Disclaimer'
import localForage from 'localforage'

const mapStateToProps = ({ blockchain: { network }, settings }: State) => ({
  accepted: settings.disclaimer_accepted,
  network,
})

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<any>) => ({
  acceptDisclaimer: async (network: string) => {
    const prevState: Settings | {} = (await localForage.getItem('settings')) || {}

    await dispatch(asyncSaveSettings({
      ...prevState,
      disclaimer_accepted: true,
      networks_accepted: {
        ...(prevState as Settings).networks_accepted,
        [network]: true,
      },
    }))

    ownProps.history.replace(ownProps.location.state && ownProps.location.state.from || '/')
    window && window.scrollTo(0, 0)
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer as any)
