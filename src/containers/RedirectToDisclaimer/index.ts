import { connect } from 'react-redux'
import { State } from 'types'

import { RedirectToDisclaimer } from 'components/RedirectIf'

const mapStateToProps = ({ settings }: State) => ({
  disclaimer_accepted: settings.disclaimer_accepted,
})


export default connect(mapStateToProps, null)(RedirectToDisclaimer)
