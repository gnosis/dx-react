import React from 'react'
import { TokenCode, TokenName, TokenMod, Balance, Account } from 'types'

export interface TokenItemProps {
  onClick?(props: TokenItemProps): any,
  mod?: TokenMod,
  balance: Balance,
  name: TokenName,
  symbol: TokenCode,
  address: Account,
}

const mod2Title: {[P in TokenMod]: string} = {
  sell: 'SELL',
  buy: 'RECEIVE',
}

const TokenItem: React.SFC<TokenItemProps> = ({ onClick, ...rest }) => {
  const { mod, balance, name, symbol } = rest
  return (
    <div className="tokenItem" onClick={onClick && (() => onClick(rest))}>
      {mod && <strong>{mod2Title[mod] || mod}</strong>}
      <i data-coin={symbol}></i>
      <big>{name}</big><code>{symbol}</code>
      <small>{mod && (mod === 'sell' ? 'AVAILABLE' : 'CURRENT')} BALANCE:</small>
      <p className={balance ? undefined : 'noBalance'}>{Number(balance).toFixed(4)} {symbol}</p>

      {/*
      MICHEL: We should ONLY show 'noMGN' when 'tokenItem' is displayed inside 'tokenList'.
      Currently this is handled by CSS but we should implement the logic here to not output the element at all.
      */}
      <p className="noMGN">Any auction with <strong>{symbol}</strong> won't generate MGN</p>
    </div>
  )
}

export default TokenItem
