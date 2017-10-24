import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

interface WalletProps {
  account: string,
  balance: Object
}

export const Wallet: React.SFC<WalletProps> = ({account, balance}) => {
  
  return (
    <i className="menuWallet">
      {/* Wallet Info - Address && Balance */}
      <span>
        <code>{`${account ? account.slice(0,14) : 'loading..'}...`}</code>
        <small>{balance} ETH</small>
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
  )
}

export default Wallet
