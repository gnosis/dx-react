import * as React from 'react'

import MenuWallet from 'containers/MenuWallet'
import MenuAuctions from 'containers/MenuAuctions'
import Hamburger from 'components/Hamburger'
import MenuFeeBalance from 'containers/MenuFeeBalance'
import { Link, withRouter } from 'react-router-dom'

interface HeaderProps {
  content?: boolean;
  match: {
    url: string;
  };
}

export const Header = ({ content, match: { url } }: HeaderProps) => (
  <header className={content ? 'solid-background' : ''}>
    <div>
      <Link to="/" title="DutchX - Dutch Auction Exchange" className="logo"></Link>
      <MenuWallet />
      <MenuAuctions />
      <MenuFeeBalance />
      <Hamburger url={url}/>
    </div>
  </header>
)

export default withRouter(Header)
