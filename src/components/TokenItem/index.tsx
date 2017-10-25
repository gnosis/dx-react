import React from 'react'

interface TokenItemProps {
  onClick?(props: TokenItemProps): void,
  mod?: string,
  balance: number,
  name: string,
  code: string,
}

const TokenItem: React.SFC<TokenItemProps> = ({ onClick, ...rest }) => {
  const { mod, balance, name, code } = rest
  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod}</strong>}
      <i data-coin={code}></i>
      <big>{name}</big><code>{code}</code>
      <small>{mod && 'AVAILABLE'} BALANCE:</small>
      <p className={balance ? undefined : 'noBalance'}>{balance} {code}</p>
    </div>
  )
}

export default TokenItem
