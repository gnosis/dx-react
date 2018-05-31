import { connect } from 'react-redux'
import { checkUserStateAndSell, openModal } from 'actions'

import WalletPanel from 'components/WalletPanel'
import { RedirectHomeHOC } from 'components/RedirectIf'

import { State } from 'types'
import { SyntheticEvent } from 'react'

const mapState = ({ tokenPair: { sellAmount } }: Partial<State>) => ({ sellAmount })

export default connect(
  mapState,
  { checkUserStateAndSell: (e: SyntheticEvent<HTMLAnchorElement>) => (e.preventDefault(), checkUserStateAndSell()), openModal },
)(RedirectHomeHOC(WalletPanel))
