import * as React from 'react'

import MenuWallet from 'containers/MenuWallet'
import MenuAuctions from 'containers/MenuAuctions'
import Hamburger from 'components/Hamburger'
import MenuFeeBalance from 'components/MenuFeeBalance'
import { Link } from 'react-router-dom'

export const Header: React.SFC = () => (
  <header>
    <div>
      <Link to="/" title="DutchX - Dutch Auction Exchange" className="logo"></Link>
      <MenuWallet />
      <MenuAuctions />
      <MenuFeeBalance />
      <Hamburger />
    </div>
  </header>
)

export default Header
