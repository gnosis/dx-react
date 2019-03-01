import React, { ComponentClass } from 'react'

import MenuWallet from 'containers/MenuWallet'
import MenuAuctions from 'containers/MenuAuctions'
import MenuOneClickToggle from 'containers/MenuOneClickToggle'
import Hamburger from 'components/Hamburger'
import MenuFeeBalance from 'containers/MenuFeeBalance'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { State } from 'types'
import { withRouter } from 'react-router'
import { getActiveProviderObject } from 'selectors'
import { COMPANY_NAME, COMPANY_SLOGAN } from 'globals'

interface HeaderProps {
  content?: boolean;
  noMenu?: boolean;
  dumb?: boolean;
}

interface HeaderState {
  network?: string | 'RINKEBY' | 'MAIN' | 'UNKNOWN';
}

export const Header = ({ content, dumb, network, noMenu }: HeaderProps & HeaderState) => (
  <header className={content ? 'solid-background' : ''}>
    <div>
      <Link
        to="/"
        title={`${COMPANY_NAME} - ${COMPANY_SLOGAN}`}
        className={`logo ${network && network.toLowerCase()}`}
      />
      {!dumb &&
      <>
        <MenuWallet />
        <MenuAuctions />
        <MenuFeeBalance />
        <MenuOneClickToggle />
      </>}
      {!noMenu && <Hamburger />}
    </div>
  </header>
)

const mapState = (state: State) => {
  const provider = getActiveProviderObject(state)

  return { network: provider ? provider.network : 'UNKNOWN NETWORK' }
}

export default withRouter(
  connect<HeaderState>(mapState)(Header) as ComponentClass<any>,
) as ComponentClass<HeaderProps>
