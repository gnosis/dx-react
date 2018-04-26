import React from 'react'

import Loader from 'components/Loader'

import 'styles/components/navbar/_navbar.scss'

import { Account, BigNumber, TokenBalances } from 'types'

export interface WalletProps {
  account: Account,
  addressToSymbolDecimal: {},
  balance: BigNumber,
  tokens: TokenBalances,
}

// TODO: use below to map addressToSymbolMap[token] = token name or symbol
/* addressToSymbolMap: {
  0x1234: 'ETH'
} */

export const MenuWallet: React.SFC<WalletProps> = ({ account, addressToSymbolDecimal, balance, tokens }) => (
  <div className="menuWallet">
    <span>
      <code>{`${account ? account.slice(0,10) : 'loading...'}...`}</code>
      <small>{balance != null ? balance.toNumber().toFixed(4) : 'loading...'} ETH</small>
    </span>
    <div>
      <Loader
      hasData={Object.keys(addressToSymbolDecimal).length > 0}
      reSize={0.2}
      render={() =>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tokens).map((addressKey: any) => {
              if (!addressToSymbolDecimal[addressKey]) return null
              const { name, decimals } = addressToSymbolDecimal[addressKey]
              return (
                <tr key={addressKey}>
                  <td>{name || 'Unknown'}</td>
                  <td>{(tokens[addressKey]).div(10 ** decimals).toFixed(4)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      }/>
    </div>
  </div>
)

export default MenuWallet
