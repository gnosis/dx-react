import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

interface WalletProps {
  account: string,
  balance: number | object,
  tokens: object,
}

export const MenuWallet: React.SFC<WalletProps> = ({ account, balance, tokens }) => (
  <i className="menuWallet">
    {/* Wallet Info - Address && Balance */}
    <span>
      <code>{`${account ? account.slice(0,10) : 'loading...'}...`}</code>
      {/* TODO: Consider creating helper function to shorten long 'string' numbers */}
      <small>{balance != null ? balance : 'loading...'} ETH</small>
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
              <td>{Number(tokens[token].balance).toFixed(4)}</td>
            </tr>,
          )}
        </tbody>
      </table>
    </div>
  </i>
)

export default MenuWallet
