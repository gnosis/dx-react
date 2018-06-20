import { connect } from 'react-redux'
import { State } from 'types'

import { RedirectToDisclaimer, RedirectToDisclaimerProps } from 'components/RedirectIf'

const mapStateToProps = ({ settings }: State) => ({
  disclaimer_accepted: settings.disclaimer_accepted,
})


export default connect<Partial<RedirectToDisclaimerProps>>(mapStateToProps, null)(RedirectToDisclaimer)
