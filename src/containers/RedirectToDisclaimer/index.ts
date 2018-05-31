import { connect } from 'react-redux'
import { State } from 'types'

import { RedirectToDisclaimer, RedirectToDosclaimerProps } from 'components/RedirectIf'

const mapStateToProps = ({ settings }: State) => ({
  disclaimer_accepted: settings.disclaimer_accepted,
})


export default connect<Partial<RedirectToDosclaimerProps>>(mapStateToProps, null)(RedirectToDisclaimer)
