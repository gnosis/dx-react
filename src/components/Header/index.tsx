import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

export const Header = () => (
  <header>
    <div>
      <a href="#" title="DutchX - Dutch Auction Exchange" className="logo"></a>
      
      {/*MENU WALLET - REFACTOR INTO COMPONENT*/}
      <i className="menuWallet">
        <span>
          <code>0xd79Ed64B47...</code>
          <small>0.1983 ETH</small>
        </span>

        <div>
          <table>
            <tr>
              <th>Token</th>
              <th>Balance</th>
            </tr>
            <tr>
              <td>ETH</td>
              <td>0.340599</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                  <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>
                            <tr>
              <td>GNO</td>
              <td>14.00349</td>
            </tr>

          </table>
        </div>
      </i>
      {/*MENU AUCTIONS - REFACTOR INTO COMPONENT*/}
      <i className="menuAuctions"><img src="/images/auction.svg" />
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
              <td><img src="images/claim.svg" /></td>
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
              <td><img src="images/claim.svg" /></td>
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
