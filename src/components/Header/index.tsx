import * as React from 'react'

import MenuWallet from 'containers/MenuWallet'
import MenuAuctions from 'containers/MenuAuctions'
import Hamburger from 'components/Hamburger'

export const Header: React.SFC = () => (
  <header>
    <div>
      <a href="#" title="DutchX - Dutch Auction Exchange" className="logo"></a>
      <MenuWallet />
      <MenuAuctions />
      <Hamburger />
    </div>
  </header>
)

export default Header
