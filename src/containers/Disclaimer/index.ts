import { connect, Dispatch } from 'react-redux'
import { asyncSaveSettings } from 'actions'
import { RouteComponentProps } from 'react-router'

import { State } from 'types'

import Disclaimer from 'components/Disclaimer'

const mapStateToProps = ({ settings }: State) => ({
  accepted: settings.disclaimer_accepted,
})

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: RouteComponentProps<any>) => ({
  acceptDisclaimer: async () => {
    await dispatch(asyncSaveSettings({
      disclaimer_accepted: true,
    }))
    
    ownProps.history.replace(ownProps.location.state && ownProps.location.state.from || '/')
    window && window.scrollTo(0, 0)
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer)
