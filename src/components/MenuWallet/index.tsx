import React from 'react'

import Loader from 'components/Loader'

import { Account, BigNumber, TokenBalances } from 'types'
import { FIXED_DECIMALS } from 'globals'

export interface WalletProps {
  account: Account,
  addressToSymbolDecimal: {},
  balance: BigNumber,
  tokens: TokenBalances,
  dxBalances: TokenBalances,
  dxBalancesAvailable: boolean,

  withdrawFromDutchX: ({ name, address }: { name: string, address: string }) => void;
}

interface WalletState {
  open: boolean,
}

export class MenuWallet extends React.Component<WalletProps, WalletState> {
  state = {
    open: false,
  }

  render () {
    const { account, addressToSymbolDecimal, balance, tokens, dxBalances, dxBalancesAvailable, withdrawFromDutchX } = this.props
    return (
      <div
        className="menuWallet"
        onClick={() => {
          const windowSize = window.innerWidth
          if (windowSize > 736) return

          this.setState({
            open: !this.state.open,
          })
        }}
      >
        <span>
          <code>{`${account ? account.slice(0, 10) : 'No Wallet Detected'}...`}</code>
          <small>{balance != null ? balance.toFixed(FIXED_DECIMALS) : '0'} ETH</small>
        </span>
        {account &&
        <div className={this.state.open ? 'mobileOpen' : ''}>
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
                  <th>{dxBalancesAvailable && 'Wallet '}Balance</th>
                  {dxBalancesAvailable && <th>DX Balance</th>}
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

                      {// Conditionally render dxBalances column
                      dxBalancesAvailable &&
                        <td className={dxBalances[addressKey] && dxBalances[addressKey].gt(0) ? 'withPic' : ''}>
                          {dxBalances[addressKey] && dxBalances[addressKey].div(10 ** decimals).toFixed(FIXED_DECIMALS)}
                          {dxBalances[addressKey] && dxBalances[addressKey].gt(0) &&
                            <img
                              src={require('assets/claim.svg')}
                              onClick={() => withdrawFromDutchX({ name, address: addressKey })}
                            />
                          }
                        </td>}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }/>
        </div>}
      </div>
    )
  }
}

export default MenuWallet
