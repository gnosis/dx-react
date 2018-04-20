import React from 'react'
import 'styles/components/navbar/_navbar.scss'

import { Account, Balance, TokenBalances } from 'types'

export interface WalletProps {
  account: Account,
  addressToSymbol: {},
  balance: Balance,
  tokens: TokenBalances,
}

// TODO: use below to map addressToSymbolMap[token] = token name or symbol
/* addressToSymbolMap: {
  0x1234: 'ETH'
} */

export const MenuWallet: React.SFC<WalletProps> = ({ account, addressToSymbol, balance, tokens }) => (
  <div className="menuWallet">
    <span>
      <code>{`${account ? account.slice(0,10) : 'loading...'}...`}</code>
      <small>{balance != null ? Number(balance).toFixed(4) : 'loading...'} ETH</small>
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
                <td>{addressToSymbol[token] || 'Unknown'}</td>
                <td>{Number(tokens[token]).toFixed(4)}</td>
              </tr>,
            )}
          </tbody>
        </table>
    </div>
  </div>
)

export default MenuWallet
