import React from 'react'

import UserProviderConnection from 'components/UserProviderConnection'
import Loader from 'components/Loader'

import { Account, BigNumber, TokenBalances } from 'types'
import { FIXED_DECIMALS, ProviderName } from 'globals'
import { provider2SVG } from 'utils'

export interface WalletProps {
  account: Account,
  addressToSymbolDecimal: {},
  balance: BigNumber,
  tokens: TokenBalances,
  dxBalances: TokenBalances,
  dxBalancesAvailable: boolean,
  hasTokenBalances: boolean,
  network: string,
  providerName: ProviderName,

  setActiveProvider: (provider: any) => void;
  withdrawFromDutchX: ({ name, address }: { name: string, address: string }) => void;
}

interface WalletState {
  open: boolean,
}

export class MenuWallet extends React.Component<WalletProps, WalletState> {
  state = {
    open: false,
  }

  changeWallet = () => this.props.setActiveProvider(null)

  handleClick = () => {
    const windowSize = window.innerWidth
    if (windowSize > 736) return

    this.setState({
      open: !this.state.open,
    })
  }

  render () {
    const {
      account,
      addressToSymbolDecimal,
      balance,
      dxBalances,
      dxBalancesAvailable,
      hasTokenBalances,
      network,
      providerName,
      tokens,
      withdrawFromDutchX,
    } = this.props
    return (
      <div
        className="menuWallet"
        tabIndex={1}
        onClick={this.handleClick}
        onBlur={() => this.setState({ open: false })}
      >
        <span>
          <small><img src={provider2SVG(providerName)} /></small>
          <code>{`${account ? account.slice(0, 10) + '...' : 'No Wallet Detected'}`}</code>
          <small>{balance != null ? balance.toFixed(FIXED_DECIMALS) : '0'} ETH</small>
        </span>
        {account && hasTokenBalances &&
        <div className={this.state.open ? 'mobileOpen' : ''}>
          <UserProviderConnection
            account={account}
            network={network}
            providerName={providerName}
            changeWallet={this.changeWallet}
          />
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
                  const tokenBalAvailable = tokens[addressKey].gt(0)
                  const dxTokenAvailable = dxBalances[addressKey]
                  const dxTokenBalAvailable = dxTokenAvailable && dxBalances[addressKey].gt(0)

                  return (
                    (tokenBalAvailable || dxTokenBalAvailable) &&
                    <tr key={addressKey}>
                      <td>{name || 'Unknown'}</td>
                      <td>{(tokens[addressKey]).div(10 ** decimals).toFixed(FIXED_DECIMALS)}</td>

                      {// Conditionally render dxBalances column
                      dxBalancesAvailable &&
                        <td className={dxTokenBalAvailable ? 'withPic' : ''}>
                          {dxTokenAvailable && dxBalances[addressKey].div(10 ** decimals).toFixed(FIXED_DECIMALS)}
                          {dxTokenBalAvailable &&
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
