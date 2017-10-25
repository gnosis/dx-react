import * as React from 'react'
import 'styles/components/navbar/_navbar.scss'

interface WalletProps {
  account: string,
  balance: Object,
  tokens: Object,
}

export const Wallet: React.SFC<WalletProps> = ({ account, balance, tokens }) => {
  
  return (
    <i className="menuWallet">
      {/* Wallet Info - Address && Balance */}
      <span>
        <code>{`${account ? account.slice(0,14) : 'loading...'}...`}</code>
        <small>{balance ? balance : 'loading...'} ETH</small>
      </span>

      <div>
        <table>
          <tr>
            <th>Token</th>
            <th>Balance</th>
          </tr>
          {Object.keys(tokens).map((token: any) => 
            <tr>
              <td>{tokens[token].name}</td>
              <td>{tokens[token].balance}</td>
          </tr>,
          )}
        </table>
      </div>
    </i>
  )
}

export default Wallet
