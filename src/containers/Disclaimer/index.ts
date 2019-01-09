import { connect } from 'react-redux'
import { asyncSaveSettings } from 'actions'
import { RouteComponentProps } from 'react-router'

import { State } from 'types'

import Disclaimer from 'components/Disclaimer'

const mapStateToProps = ({ blockchain: { network }, settings }: State) => ({
  accepted: settings.disclaimer_accepted,
  network,
})

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<any>) => ({
  acceptDisclaimer: async (network: string) => {
    await dispatch(asyncSaveSettings({
      disclaimer_accepted: true,
      networks_accepted: {
        [network]: true,
      },
    }))

    ownProps.history.replace(ownProps.location.state && ownProps.location.state.from || '/')
    window && window.scrollTo(0, 0)
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer as any)
