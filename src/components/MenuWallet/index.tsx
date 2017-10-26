import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

interface WalletProps {
  account: string,
  balance: Object,
  tokens: Object,
}

export const MenuWallet: React.SFC<WalletProps> = ({ account, balance, tokens }) => (
  <i className="menuWallet">
    {/* Wallet Info - Address && Balance */}
    <span>
      <code>{`${account ? account.slice(0,14) : 'loading...'}...`}</code>
      <small>{balance || balance === 0 ? balance : 'loading...'} ETH</small>
    </span>

    <div>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(tokens).map((token: any) => 
            <tr key={tokens[token].name}>
              <td>{tokens[token].name}</td>
              <td>{tokens[token].balance}</td>
            </tr>,
          )}
        </tbody>
      </table>
    </div>
  </i>
)

export default MenuWallet
