import React from 'react'
import { TokenCode, TokenName, TokenMod, Balance } from 'types'

export interface TokenItemProps {
  onClick?(props: TokenItemProps): any,
  mod?: TokenMod,
  balance: Balance,
  name: TokenName,
  code: TokenCode,
}

const mod2Title: {[P in TokenMod]: string} = {
  sell: 'SELL',
  buy: 'RECEIVE',
}

const TokenItem: React.SFC<TokenItemProps> = ({ onClick, ...rest }) => {
  const { mod, balance, name, code } = rest
  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod2Title[mod] || mod}</strong>}
      <i data-coin={code}></i>
      <big>{name}</big><code>{code}</code>
      <small>{mod && (mod === 'sell' && 'AVAILABLE' || 'CURRENT')} BALANCE:</small>
      <p className={balance ? undefined : 'noBalance'}>{balance} {code}</p>
    </div>
  )
}

export default TokenItem
