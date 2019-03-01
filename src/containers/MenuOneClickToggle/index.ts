import { connect } from 'react-redux'

import MenuOneClickMode from 'components/MenuOneClickToggle'

import { State } from 'types'

const mapState = ({ oneClickMode }: State) => ({
  oneClickMode,
})

export default connect(mapState)(MenuOneClickMode)
