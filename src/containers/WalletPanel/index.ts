import WalletPanel from 'components/WalletPanel'

import { SyntheticEvent } from 'react'
import { connect } from 'react-redux'

import { checkUserStateAndSell, openModal } from 'actions'
import { getProviderName } from 'selectors'

import { RedirectHomeHOC } from 'components/RedirectIf'

import { State } from 'types'

const mapState = (state: State) => {
  const activeProvider = getProviderName(state)
  return ({
    activeProvider,
    sellAmount: state.tokenPair.sellAmount,
  })
}

export default connect(
  mapState,
  { checkUserStateAndSell: (e: SyntheticEvent<HTMLAnchorElement>) => (e.preventDefault(), checkUserStateAndSell()), openModal },
)(RedirectHomeHOC(WalletPanel))
