import { connect } from 'react-redux'
import { State } from 'types'

import { RedirectToDisclaimer, RedirectToDisclaimerProps } from 'components/RedirectIf'
import { withRouter } from 'react-router'
import { ComponentClass } from 'react'

const mapStateToProps = ({ settings }: State) => ({
  disclaimer_accepted: settings.disclaimer_accepted || false,
})

export default withRouter(connect<Partial<RedirectToDisclaimerProps>>(mapStateToProps, null)(RedirectToDisclaimer) as ComponentClass<any>)
