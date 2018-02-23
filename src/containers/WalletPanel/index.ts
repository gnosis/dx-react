import { connect } from 'react-redux'
import { getTokenAllowance, openModal } from 'actions'

import WalletPanel from 'components/WalletPanel'
import { RedirectHomeHOC } from 'components/RedirectIf'

import { State } from 'types'

const mapState = ({ tokenPair: { sellAmount } }: Partial<State>) => ({ sellAmount })

export default connect(mapState, { getTokenAllowance, openModal })(RedirectHomeHOC(WalletPanel))
