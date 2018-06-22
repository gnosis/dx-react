import * as React from 'react'

import MenuWallet from 'containers/MenuWallet'
import MenuAuctions from 'containers/MenuAuctions'
import Hamburger from 'components/Hamburger'
import MenuFeeBalance from 'containers/MenuFeeBalance'
import { Link } from 'react-router-dom'

interface HeaderProps {
  content?: boolean;
}

export const Header = ({ content }: HeaderProps) => (
  <header className={content && 'solid-background'}>
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
