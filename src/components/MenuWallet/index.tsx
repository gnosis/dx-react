import React from 'react'

import Loader from 'components/Loader'

import { Account, BigNumber, TokenBalances } from 'types'
import { FIXED_DECIMALS } from 'globals'
import { withdraw } from 'api'

export interface WalletProps {
  account: Account,
  addressToSymbolDecimal: {},
  balance: BigNumber,
  tokens: TokenBalances,
  dxBalances: TokenBalances,
}

// TODO: use below to map addressToSymbolMap[token] = token name or symbol
/* addressToSymbolMap: {
  0x1234: 'ETH'
} */

export const MenuWallet: React.SFC<WalletProps> = ({ account, addressToSymbolDecimal, balance, tokens, dxBalances }) => (
  <div className="menuWallet">
    <span>
      <code>{`${account ? account.slice(0, 10) : 'No Wallet Detected'}...`}</code>
      <small>{balance != null ? balance.toNumber().toFixed(FIXED_DECIMALS) : '0'} ETH</small>
    </span>
    {account && <div>
      <Loader
      hasData={Object.keys(addressToSymbolDecimal).length > 0}
      message="Enable wallet"
      svgHeight={35}
      reSize={0.25}
      render={() =>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet Balance</th>
              <th>DX Balance</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tokens).map((addressKey: any) => {
              if (!addressToSymbolDecimal[addressKey]) return null
              const { name, decimals } = addressToSymbolDecimal[addressKey]
              return (
                tokens[addressKey].gt(0) &&
                <tr key={addressKey}>
                  <td>{name || 'Unknown'}</td>
                  <td>{(tokens[addressKey]).div(10 ** decimals).toFixed(FIXED_DECIMALS)}</td>
                  <td className={dxBalances[addressKey] && dxBalances[addressKey].gt(0) ? 'withPic' : ''}>
                    {dxBalances[addressKey] && dxBalances[addressKey].div(10 ** decimals).toFixed(FIXED_DECIMALS)}
                    {dxBalances[addressKey] && dxBalances[addressKey].gt(0) &&
                      <img
                        src={require('assets/claim.svg')}
                        onClick={() => withdraw(addressKey)}
                      />
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      }/>
    </div>}
  </div>
)

export default MenuWallet
