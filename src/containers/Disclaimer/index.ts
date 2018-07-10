import { connect, Dispatch } from 'react-redux'
import { asyncSaveSettings } from 'actions'
import { RouteComponentProps } from 'react-router'

import { State } from 'types'

import Disclaimer from 'components/Disclaimer'

const mapStateToProps = ({ settings }: State) => ({
  accepted: settings.disclaimer_accepted,
})

// const acceptDisclaimer = async () => {
//   await asyncSaveSettings({
//     disclaimer_accepted: true,
//   })
// }

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: RouteComponentProps<any>) => ({
  acceptDisclaimer: async () => {
    await dispatch(asyncSaveSettings({
      disclaimer_accepted: true,
    }))
    
    
    console.log('ownProps: ', ownProps)
    ownProps.history.replace(ownProps.location.state && ownProps.location.state.from || '/')
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer)
