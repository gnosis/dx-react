import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

import Wallet from 'containers/Wallet'

const tokens = {
  GNO: {
    name: 'GNO',
    balance: 12,
  },
}

export const Header = () => (
  <header>
    <div>
      <a href="#" title="DutchX - Dutch Auction Exchange" className="logo"></a>
      
      {/*MENU WALLET - REFACTOR INTO COMPONENT*/}
      <Wallet tokens={tokens}/>
      {/*MENU AUCTIONS - REFACTOR INTO COMPONENT*/}
      <i className="menuAuctions"><img src={require('assets/auction.svg')} />
        <strong>Your Auctions</strong>
        <div>
          <table>
            <tr>
              <th>Auction</th>
              <th>Comitted</th>
              <th>Claim Token</th>
            </tr>
            <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td><img src={require('assets/claim.svg')} /></td>
            </tr>
            <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td><img src={require('assets/claim.svg')} /></td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
                      <tr>
              <td>ETH/GNO</td>
              <td>134.034 GNO</td>
              <td>-</td>
            </tr>
          </table>
        </div>
      </i>

      {/*HAMBURGER BUTTON - REFACTOR INTO COMPONENT*/}
      <button className="hamburger"></button>
      
      <nav>
        <button className="buttonExit"></button>
        <a href="#">How it works</a>
        <a href="#">About</a>
        <a href="#">Faq</a>
      </nav>
    </div>
  </header>
)

export default Header
