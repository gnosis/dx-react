import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

import MenuWallet from 'containers/MenuWallet'
import MenuAuctions from 'components/MenuAuctions'
import Hamburger from 'components/Hamburger'

// TODO: move this
const ongoingAuctions = [
  {
    id: '123',
    sellToken: 'ETH',
    buyToken: 'GNO',
    buyPrice: 117,
    claim: true
  },
]

export const Header: React.SFC = () => (
  <header>
    <div>
      <a href="#" title="DutchX - Dutch Auction Exchange" className="logo"></a>
      
      {/*MENU WALLET*/}
      <MenuWallet />
      {/*MENU AUCTIONS - REFACTOR INTO COMPONENT*/}
      <MenuAuctions ongoingAuctions={ongoingAuctions}/>
      {/*HAMBURGER BUTTON - REFACTOR INTO COMPONENT*/}
      <Hamburger />

    </div>
  </header>
)

export default Header
