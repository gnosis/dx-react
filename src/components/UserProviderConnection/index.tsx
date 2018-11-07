import React from 'react'

import { provider2SVG } from 'utils'
import { ProviderName, ProviderType } from 'globals'

interface UserProviderConnectionProps {
  account: string,
  network: string,
  providerName: ProviderName | ProviderType,
  changeWallet: () => void,
}

const UserProviderConnection: React.SFC<UserProviderConnectionProps> = ({
    providerName,
    network,
    account,
    changeWallet,
}) =>
    <>
        <span onClick={changeWallet}>
            <img src={provider2SVG(providerName)} />
            <p>
              <strong>{providerName}</strong>
              <i>{network}</i>
            </p>
            <code>{account}</code>
          </span>

          <table>
            <thead>
              <tr>
                <th>WALLET</th>
                <th>ACCOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td onClick={this.changeWallet}>
                  <h5><code>{providerName}</code></h5>
                </td>
                <td>
                  <h5><code>{account}</code></h5>
                </td>
              </tr>
            </tbody>
          </table>
    </>

export default UserProviderConnection
