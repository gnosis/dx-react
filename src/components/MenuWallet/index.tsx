import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

import { TokenBalances } from 'types'

export interface WalletProps {
  account: string,
  balance: string | any,
  tokens: TokenBalances,
}

export const MenuWallet: React.SFC<WalletProps> = ({ account, balance, tokens }) => (
  <div className="menuWallet">
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
              <tr key={token}>
                <td>{token}</td>
                <td>{Number(tokens[token]).toFixed(4)}</td>
              </tr>,
            )}
          </tbody>
        </table>
    </div>
  </div>
)

export default MenuWallet
