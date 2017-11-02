import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

import { Tokens } from 'types'

export interface WalletProps {
  account: string,
  balance: string | any,
  tokens: Tokens,
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
      {Object.keys(tokens).length ?
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
        :
        <table>
          <tbody>
            <tr><td>No Tokens Available</td></tr>
          </tbody>
        </table>
      }    
    </div>
  </div>
)

export default MenuWallet
